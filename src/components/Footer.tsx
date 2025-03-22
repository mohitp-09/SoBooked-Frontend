import React from "react";
import { Book, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Book className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-white">
                SoBooked
              </span>
            </div>
            <p className="text-sm">
              Your premier destination for discovering and purchasing quality
              books online.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Categories
            </h3>
            <ul className="space-y-2">
              <li>Fiction</li>
              <li>Non-Fiction</li>
              <li>Children's Books</li>
              <li>Academic</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                info@sobooked.com
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                +91 9691349434
              </li>
              <li className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Knowledge Village, Indore, Madhya Pradesh, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>
            &copy; {new Date().getFullYear()} SoBooked. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
