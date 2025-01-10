
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function RestaurantReviews() {
  const params = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantReviews = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}api/restaurants/${params.id}/reviews`);
        setRestaurant(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRestaurantReviews();
  }, [params.id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center space-x-6 mb-6">
            <img
              src={restaurant?.photoUrl || "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
              alt={restaurant?.restaurantName}
              className="w-32 h-32 rounded-lg object-cover shadow-lg"
            />
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{restaurant?.restaurantName}</h1>
              <p className="text-gray-600 text-lg mb-2">{restaurant?.cuisineType}</p>
              <div className="flex items-center gap-3">
                <span className="text-yellow-500 text-2xl">
                  {"★".repeat(Math.floor(restaurant?.averageRating || 0))}
                  {(restaurant?.averageRating % 1) >= 0.5 && "½"}
                </span>
                <span className="text-gray-600 font-medium">
                  {restaurant?.averageRating?.toFixed(1) || "No"} / 5
                </span>
                <span className="text-gray-500">
                  ({restaurant?.reviews?.length || 0} reviews)
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {restaurant?.reviews?.map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{review.username}</h3>
                  <p className="text-gray-500 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-2">
                    {"★".repeat(review.rating)}
                  </span>
                  <span className="text-gray-600">{review.rating}/5</span>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{review.comment}</p>
            </motion.div>
          ))}

          {restaurant?.reviews?.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No reviews yet for this restaurant.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
