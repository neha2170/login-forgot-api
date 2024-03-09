// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const userRoutes = require("./routes/userRoutes");
// const authRoutes = require("./routes/authRoutes");

// const app = express();

// // Middleware setup
// app.use(bodyParser.json());

// // Connect to MongoDB with the correct connection string
// mongoose
//   .connect("mongodb+srv://neha:neha@cluster0.tozwtag.mongodb.net/", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to MongoDB");

//     // Use routes after successful connection
//     app.use("/api", userRoutes);
//     app.use("/api", authRoutes);

//     // Start the server
//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Error connecting to MongoDB:", error);
//   });

// Import necessary modules and packages
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware setup
app.use(bodyParser.json());

// Connect to MongoDB with the correct connection string
mongoose
  .connect("mongodb+srv://neha:neha@cluster0.tozwtag.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    // Use routes after successful connection
    app.use("/api/users", userRoutes); // Changed "/api" to "/api/users"
    app.use("/api/auth", authRoutes); // Changed "/api" to "/api/auth"

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
