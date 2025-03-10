import React, { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  Camera,
  Upload,
  BookOpen,
  DollarSign,
  MapPin,
  BookType,
  X,
  ChevronDown,
  Phone,
  FileText
} from "lucide-react";
import Swal from 'sweetalert2';
import imageCompression from 'browser-image-compression';

interface BookFormData {
  name: string;
  author: string;
  buyPrice: number;
  rentalPrice: number;
  category: string;
  city: string;
  description: string;
  phoneNumber: string;
}

// Utility function to properly capitalize text
const formatText = (text: string): string => {
  // Handle empty or null input
  if (!text) return "";

  // Split the text into words
  return text
    .toLowerCase()
    .split(' ')
    .map(word => {
      // Skip empty words
      if (!word) return word;
      
      // List of words that should remain lowercase (unless at start)
      const lowercaseWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'in', 'of'];
      
      // If it's a lowercase word and not at the start, keep it lowercase
      if (lowercaseWords.includes(word) && text.indexOf(word) !== 0) {
        return word;
      }
      
      // Capitalize the first letter and keep the rest in original case
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

// Format city name
const formatCityName = (city: string): string => {
  if (!city) return "";
  return city.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const categories = [
  "Fiction",
  "Non-Fiction",
  "Science Fiction",
  "Mystery",
  "Romance",
  "Biography",
  "History",
  "Science",
  "Technology",
  "Self-Help",
  "Children's",
  "Poetry",
];

const cities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Indore",
  "Bhopal",
  "Gwalior",
  "Jabalpur",
  "Ujjain",
];

const AddBook: React.FC = () => {
  const [formData, setFormData] = useState<BookFormData>({
    name: "",
    author: "",
    buyPrice: 0,
    rentalPrice: 0,
    category: "",
    city: "",
    description: "",
    phoneNumber: ""
  });

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const cityInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const navigate = useNavigate();

  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Format different input types appropriately
    const formattedValue = 
      name === "name" || name === "author" ? formatText(value) :
      name === "city" ? formatCityName(value) :
      name === "description" ? value :  // Remove trim() to allow spaces
      name === "buyPrice" || name === "rentalPrice" ? parseFloat(value) :
      name === "phoneNumber" && value.trim() === "" ? null : 
      value;

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleCityClick = (city: string) => {
    const formattedCity = formatCityName(city);
    setFormData(prev => ({ ...prev, city: formattedCity }));
    setCitySearch(formattedCity);
    setShowCityDropdown(false);
  };

  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCity = formatCityName(e.target.value);
    setCitySearch(e.target.value);
    setFormData(prev => ({ ...prev, city: formattedCity }));
    setShowCityDropdown(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      setIsConverting(true);

      // Compression options
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/jpeg'
      };

      // Compress the image
      const compressedFile = await imageCompression(selectedFile, options);
      
      // Create a new file with a .jpg extension
      const finalFile = new File(
        [compressedFile],
        selectedFile.name.replace(/\.(heic|png|jpeg|jpg|gif)$/i, '.jpg'),
        { type: 'image/jpeg' }
      );

      setFile(finalFile);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(finalFile);

      setIsConverting(false);
    } catch (error) {
      console.error('Error processing image:', error);
      await Swal.fire({
        icon: "error",
        title: "Failed to process image",
        text: "Please try a different image format",
        toast: true,
        position: "bottom",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#ffffff",
        iconColor: "#EF4444",
        customClass: {
          popup: "rounded-xl border-2 border-red-400",
          title: "text-gray-800 font-medium text-lg",
        },
      });
      setIsConverting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      // Final formatting before submission
      const finalFormData = {
        ...formData,
        name: formatText(formData.name),
        author: formatText(formData.author),
        city: formatCityName(formData.city),
        description: formData.description.trim()  // Only trim at submission
      };

      const bookData = JSON.stringify({
        ...finalFormData,
        availableForRent: finalFormData.rentalPrice > 0
      });
  
      const formDataToSend = new FormData();
      formDataToSend.append("book", bookData);
      
      if (file) {
        formDataToSend.append("file", file);
      } else {
        const emptyBlob = new Blob([], { type: "image/png" });
        formDataToSend.append("file", emptyBlob, "empty.png");
      }
  
      const response = await fetch(
        "https://sobooked.onrender.com/api/add",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      // First try to get the response as text
      const responseText = await response.text();
      
      // If the response is not OK, throw an error
      if (!response.ok) {
        throw new Error(responseText || `HTTP error! status: ${response.status}`);
      }

      // If we got here, the book was added successfully
      await Swal.fire({
        icon: "success",
        title: `📚 "${finalFormData.name}" has been added to your collection!`,
        toast: true,
        position: "bottom",
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#f9fafb",
        iconColor: "#4F46E5",
        customClass: {
          popup: "rounded-lg border border-indigo-500 shadow-md px-4 py-2 max-w-[280px] sm:max-w-[320px]", 
          title: "text-gray-900 font-medium text-sm sm:text-base tracking-wide text-center",
          timerProgressBar: "bg-indigo-500",
        },
      });
      
  
      // Reset form
      setFormData({
        name: "",
        author: "",
        buyPrice: 0,
        rentalPrice: 0,
        category: "",
        city: "",
        description: "",
        phoneNumber: ""
      });
      setPreviewUrl(null);
      setFile(null);
      setCitySearch("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error('Error adding book:', error);
      await Swal.fire({
        icon: "error",
        title: error instanceof Error ? error.message : "Failed to add book",
        toast: true,
        position: "bottom",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#ffffff",
        iconColor: "#EF4444",
        customClass: {
          popup: "rounded-xl border-2 border-red-400",
          title: "text-gray-800 font-medium text-lg",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityInputRef.current && !cityInputRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 pt-16 px-4 sm:px-6 lg:px-8 pb-8">
      <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="mb-8 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Catalog
      </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Book</h1>
            <p className="text-gray-500 mt-1">
              Share your book with the community
            </p>
          </div>
          <BookOpen className="w-10 h-10 text-blue-600" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Book Details
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Enter the basic information about your book
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter book name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter author name"
                    required
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 my-6"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selling Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      name="buyPrice"
                      min="0"
                      step="0.01"
                      value={formData.buyPrice}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rental Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      name="rentalPrice"
                      min="0"
                      step="0.01"
                      value={formData.rentalPrice}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative" ref={cityInputRef}>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={citySearch}
                        onChange={handleCityInputChange}
                        onFocus={() => setShowCityDropdown(true)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Search for a city"
                        required
                      />
                      <ChevronDown className={`absolute right-3 top-2.5 h-5 w-5 text-gray-400 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
                    </div>
                    
                    {showCityDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                        {filteredCities.length > 0 ? (
                          filteredCities.map((city) => (
                            <div
                              key={city}
                              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2"
                              onClick={() => handleCityClick(city)}
                            >
                              <MapPin className="h-4 w-4" />
                              {city}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500 text-sm">
                            No cities found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter book description"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Book Cover
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Upload a high-quality image of your book (JPEG, PNG, GIF supported)
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all
                    ${
                      previewUrl
                        ? "border-gray-300 bg-gray-50"
                        : "border-gray-300 hover:border-blue-500"
                    }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    required
                  />
                  <div className="text-center">
                    {isConverting ? (
                      <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <div className="mt-4 text-sm text-gray-600">
                          Compressing image...
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4 text-sm text-gray-600">
                          <span className="font-semibold text-blue-600">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          JPEG, PNG, GIF up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {previewUrl && (
                <div className="relative w-full sm:w-48 aspect-[3/4]">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg flex items-center justify-center transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isConverting}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg ${
              isSubmitting || isConverting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Book...
              </>
            ) : (
              <>
                <BookOpen className="w-5 h-5" />
                Add Book to Library
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;