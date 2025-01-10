"use client";
import RestaurantCard from "../../components/RestaurantCard";
import { motion } from "framer-motion";
import Particles from "../../components/ui/particles";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const Page = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState(0);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}api/restaurants`);
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.cuisineType.toLowerCase().includes(searchTerm.toLowerCase());
    // Note: Rating filter removed since it's not in the API data
    return matchesSearch;
  });

  const handleAddReview = (restaurantId) => {
    router.push(`/reviews/${restaurantId}`);
  };

  return (
    <main className="relative min-h-screen flex flex-col">
      {/* Background Particles */}
      <Particles
        className="absolute inset-0 -z-10"
        quantity={100}
        staticity={30}
        color="#94a3b8"
      />
      
      {/* Main Content Container */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 bg-gradient-to-b from-white/80 to-gray-100/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32"
      >
        {/* Header */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Restaurant Reviews
            </span>
          </h1>
        </motion.header>

        {/* Search & Filter Section */}
        <section className="max-w-7xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center px-4">
            {/* Search Input */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-96"
            >
              <input
                type="text"
                placeholder="Search restaurants or cuisines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
            </motion.div>
          </div>
        </section>

        {/* Restaurant Grid */}
        <section className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              >
                {filteredRestaurants.map((restaurant, index) => (
                  <motion.div
                    key={restaurant._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    className="transform transition-all duration-300 hover:shadow-xl rounded-xl"
                  >
                    <RestaurantCard 
                      name={restaurant.restaurantName}
                      rating={Math.round(restaurant.averageRating || 0)} // Round the rating to nearest integer
                      reviewCount={restaurant.reviews?.length || 0}
                      imageUrl={restaurant.photoUrl}
                      onAddReview={() => handleAddReview(restaurant._id)}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* No Results Message */}
              {filteredRestaurants.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-500 mt-12 text-lg"
                >
                  No restaurants found matching your criteria
                </motion.p>
              )}
            </>
          )}
        </section>
      </motion.div>
    </main>
  );
};

export default Page;