"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import HyperText from "../../../components/ui/hyper-text";
import Particles from "../../../components/ui/particles";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const AddReviewPage = () => {
  const router = useRouter();
  const params = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}api/restaurants/${params.id}/reviews`);
        setRestaurant(response.data);
        // Sort reviews by createdAt in descending order (most recent first)
        const sortedReviews = [...(response.data.reviews || [])].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setReviews(sortedReviews);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
        setError("Failed to load restaurant details");
      }
    };

    fetchRestaurant();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    try {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.post(
        `${BACKEND_URL}api/restaurants/${params.id}/reviews`,
        {
          rating,
          comment
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'token': `Bearer ${token}`
          }
        }
      );

      setRestaurant(response.data);
      // Sort reviews by createdAt in descending order after adding new review
      const sortedReviews = [...(response.data.reviews || [])].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setReviews(sortedReviews);
      router.push('/reviews');
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error.response?.data?.message || "Failed to submit review. Please try again.");
    }
  };

  return (
    <div className="min-h-screen relative pt-20">
      <Particles
        className="absolute inset-0 -z-10"
        quantity={100}
        staticity={30}
        color="#94a3b8"
      />

      {restaurant && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <img
              src={restaurant.photoUrl}
              alt={restaurant.restaurantName}
              className="w-24 h-24 rounded-lg object-cover shadow-lg"
            />
            <div>
              <HyperText
                text={restaurant.restaurantName}
                className="text-3xl font-bold mb-2"
              />
              <p className="text-gray-600">{restaurant.cuisineType}</p>
              {restaurant.averageRating && (
                <div className="flex items-center mt-1">
                  <span className="text-yellow-400 text-lg mr-1">★</span>
                  <span className="text-gray-700">
                    {restaurant.averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-500 ml-1">
                    ({reviews.length} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-8">
            {/* Left Column - Review Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8"
            >
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                  {error}
                </div>
              )}

              <div className="text-center mb-8">
                <div className="w-[50%]">
                  <HyperText
                    text="Write a Review"
                    className="text-2xl font-bold"
                  />
                </div>
                <p className="mt-2 text-gray-600">
                  Share your dining experience
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-3xl transition-all duration-200 transform hover:scale-110 ${
                          rating >= star ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={6}
                    className="mt-1 block w-full rounded-lg border border-gray-300 py-3 px-4 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="What did you like or dislike? How was the food, service, and atmosphere?"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/reviews")}
                    className="flex-1 py-3 px-6 border border-gray-300 rounded-lg shadow-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Right Column - Previous Reviews */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">Previous Reviews</h3>
              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4">
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-200 pb-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{review.username}</span>
                        <div className="flex items-center">
                          <span className="text-yellow-400">
                            {"★".repeat(review.rating)}
                          </span>
                          <span className="text-gray-300">
                            {"★".repeat(5 - review.rating)}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-600">{review.comment}</p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddReviewPage;