"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChefHat, MapPin, Phone, FileText, Utensils, Image } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function AddRestaurant() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    restaurantName: '',
    cuisineType: '',
    description: '',
    address: '',
    phoneNumber: '',
    photoUrl: ''
  });
  const [error, setError] = useState('');

  // Check for token on component mount
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.post(
        `${BACKEND_URL}api/restaurants`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'token': `Bearer ${token}`
          }
        }
      );

      router.push('/restaurant-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add restaurant');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { type: "spring", stiffness: 300 } }
  };

  const formFieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <div className="h-screen overflow-y-auto bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-100 via-blue-50 to-gray-100 p-8 pt-32">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="backdrop-blur-xl bg-white/60 p-8 rounded-3xl shadow-2xl border border-white/30 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10 blur-3xl -z-10" />
          
          <Link 
            href="/restaurant-dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 group bg-white/70 px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-2 transition-transform duration-300" />
            Back to Dashboard
          </Link>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-3"
          >
            Add New Restaurant
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 mb-12 text-lg"
          >
            Fill in the details below to add your restaurant
          </motion.p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <motion.div
                variants={formFieldVariants}
                custom={0}
                initial="hidden"
                animate="visible"
                className="group"
              >
                <label htmlFor="restaurantName" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <ChefHat className="h-4 w-4 text-blue-500" />
                  Restaurant Name
                </label>
                <motion.input
                  variants={inputVariants}
                  whileFocus="focus"
                  type="text"
                  id="restaurantName"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm"
                  required
                />
              </motion.div>

              <motion.div
                variants={formFieldVariants}
                custom={1}
                initial="hidden"
                animate="visible"
                className="group"
              >
                <label htmlFor="cuisineType" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Utensils className="h-4 w-4 text-purple-500" />
                  Cuisine Type
                </label>
                <motion.input
                  variants={inputVariants}
                  whileFocus="focus"
                  type="text"
                  id="cuisineType"
                  name="cuisineType"
                  value={formData.cuisineType}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/70 backdrop-blur-sm"
                  required
                />
              </motion.div>

              <motion.div
                variants={formFieldVariants}
                custom={2}
                initial="hidden"
                animate="visible"
                className="group"
              >
                <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 text-pink-500" />
                  Description
                </label>
                <motion.textarea
                  variants={inputVariants}
                  whileFocus="focus"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 bg-white/70 backdrop-blur-sm"
                  required
                />
              </motion.div>

              <motion.div
                variants={formFieldVariants}
                custom={3}
                initial="hidden"
                animate="visible"
                className="group"
              >
                <label htmlFor="address" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  Address
                </label>
                <motion.input
                  variants={inputVariants}
                  whileFocus="focus"
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm"
                  required
                />
              </motion.div>

              <motion.div
                variants={formFieldVariants}
                custom={4}
                initial="hidden"
                animate="visible"
                className="group"
              >
                <label htmlFor="phoneNumber" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 text-purple-500" />
                  Phone Number
                </label>
                <motion.input
                  variants={inputVariants}
                  whileFocus="focus"
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/70 backdrop-blur-sm"
                  required
                />
              </motion.div>

              <motion.div
                variants={formFieldVariants}
                custom={5}
                initial="hidden"
                animate="visible"
                className="group"
              >
                <label htmlFor="photoUrl" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Image className="h-4 w-4 text-pink-500" />
                  Photo URL
                </label>
                <motion.input
                  variants={inputVariants}
                  whileFocus="focus"
                  type="url"
                  id="photoUrl"
                  name="photoUrl"
                  value={formData.photoUrl}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 bg-white/70 backdrop-blur-sm"
                  required
                />
              </motion.div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-xl transition-all duration-500 transform hover:-translate-y-1 hover:shadow-xl font-medium text-lg"
            >
              Add Restaurant
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
