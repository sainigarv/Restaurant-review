const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const User = require('./models/user')
require('dotenv').config();
const authenticateToken = require("./middlewares/authenticateToken");

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurants', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const userRouter = require("./routes/user"); // Import the user router

// Use the user router for user-related routes
app.use("/api/users", userRouter);



const restaurantRouter = require("./routes/restaurant");
app.use("/api/restaurants", restaurantRouter); // Fixed typo in 'restaurants'

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
