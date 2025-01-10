"use client";

import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function RestaurantsPage() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}api/restaurants`);
        setRestaurants(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleAddRestaurant = () => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    router.push('/restaurant-dashboard/add');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8 pt-32">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-12"
        >
          <div className="space-y-2">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600">
              All Restaurants
            </h1>
            <p className="text-gray-600 text-lg">Manage your restaurant portfolio</p>
          </div>
          <button
            onClick={handleAddRestaurant}
            className="group px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-lg transition-all flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <PlusCircle className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-lg font-medium">
              Add New Restaurant
            </span>
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant, index) => (
            <Link href={`/restaurant-dashboard/${restaurant._id}`} key={restaurant._id}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={restaurant.photoUrl || "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                    alt={restaurant.restaurantName}
                    className="object-cover h-full w-full transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                    {restaurant.restaurantName}
                  </h3>
                  <p className="text-gray-600 mb-4 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                    {restaurant.cuisineType}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-yellow-500 tracking-wider">
                      {"★".repeat(Math.floor(restaurant.ratingStats.averageRating || 0))}
                      {(restaurant.ratingStats.averageRating % 1) >= 0.5 && "½"}
                    </span>
                    <span className="text-gray-600 font-medium bg-gray-50 px-3 py-1 rounded-full">
                      {restaurant.ratingStats.averageRating?.toFixed(1) || "No"} / 5
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
