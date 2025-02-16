import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Step 1: Create payment intent by placing order
      const orderResponse = await fetch('https://online-bookstore-rrd8.onrender.com/placeOrder', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.text();
        console.error('Server response:', errorData);
        
        if (orderResponse.status === 403) {
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error(`Order placement failed: ${errorData}`);
      }

      const orderData = await orderResponse.json();
      console.log(orderData);
      const { clientSecret } = orderData;
      console.log(clientSecret)

      if (!clientSecret) {
        throw new Error('No client secret received from the server');
      }

      // Step 2: Confirm the payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            address: {
              country: 'IN',
            },
          },
        },
      });

      if (result.error) {
        console.error('Payment confirmation error:', result.error);
        throw new Error(result.error.message || 'Payment failed');
      }

      console.log(result.paymentIntent.status)

      if (result.paymentIntent.status !== 'requires_capture') {
        throw new Error('Payment was not successful');
      }

      // Step 3: Confirm payment with our backend
      const confirmResponse = await fetch(`https://online-bookstore-rrd8.onrender.com/pay?paymentId=${result.paymentIntent.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });

      if (!confirmResponse.ok) {
        const confirmErrorData = await confirmResponse.text();
        console.error('Payment confirmation error:', confirmErrorData);
        throw new Error('Failed to confirm payment with server');
      }

      // Payment successful
      onSuccess();
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed');
      
      if (err instanceof Error && err.message.includes('session expired')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-6">Complete Payment</h2>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Amount to pay:</p>
          <p className="text-2xl font-bold text-gray-900">₹{amount.toFixed(2)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
                hidePostalCode: true,
              }}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!stripe || processing}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium 
                     hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 
                     disabled:cursor-not-allowed transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {processing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              'Pay Now'
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            This is a secure, encrypted payment
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;