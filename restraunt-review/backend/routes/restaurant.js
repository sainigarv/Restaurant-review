const express = require("express");
const router = express.Router();
const Restaurant = require("../models/restaurant");
const authenticateToken = require("../middlewares/authenticateToken");

// Route to add a new restaurant
router.post("/", authenticateToken, async (req, res) => {
  try {
    const newRestaurant = new Restaurant({
      restaurantName: req.body.restaurantName,
      cuisineType: req.body.cuisineType,
      description: req.body.description,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      photoUrl: req.body.photoUrl,
    });

    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to get all restaurants
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate(
      "reviews.user",
      "username"
    );

    // Calculate rating statistics for each restaurant
    const restaurantsWithStats = restaurants.map((restaurant) => {
      const stats = restaurant.calculateRatingStats();
      return {
        ...restaurant.toObject(),
        ratingStats: stats,
      };
    });

    res.json(restaurantsWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to add a review to a restaurant
router.post(
  "/:restaurantId/reviews",
  authenticateToken,
  async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const userId = req.user.id;
      const restaurant = await Restaurant.findById(req.params.restaurantId);

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Add the new review
      restaurant.reviews.push({
        user: userId,
        rating,
        comment,
      });

      // Calculate new average rating
      const totalRatings = restaurant.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      restaurant.averageRating = totalRatings / restaurant.reviews.length;

      const updatedRestaurant = await restaurant.save();

      // Populate the user field in the reviews before sending response
      await updatedRestaurant.populate("reviews.user", "username");

      res.status(201).json(updatedRestaurant);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Route to get all reviews for a specific restaurant
router.get("/:restaurantId/reviews", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(
      req.params.restaurantId
    ).populate("reviews.user", "username");

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const restaurantObj = restaurant.toObject();
    const reviewsWithUsername = restaurantObj.reviews.map((review) => ({
      ...review,
      username: review.user.username,
      user: review.user._id,
    }));

    res.json({
      ...restaurantObj,
      reviews: reviewsWithUsername,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
