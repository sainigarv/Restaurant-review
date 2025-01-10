const mongoose = require('mongoose')

// Restaurant Schema

const restaurantSchema = new mongoose.Schema({
  restaurantName: {
    type: String,
    required: true,
  },
  cuisineType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    required: true,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  averageRating: {
    type: Number,
    default: 0,
  },
});

// Add a method to calculate ratings statistics
restaurantSchema.methods.calculateRatingStats = function () {
  if (!this.reviews.length) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRating = 0;

  this.reviews.forEach((review) => {
    totalRating += review.rating;
    ratingDistribution[review.rating]++;
  });

  return {
    averageRating: parseFloat((totalRating / this.reviews.length).toFixed(1)),
    totalReviews: this.reviews.length,
    ratingDistribution,
  };
};

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
