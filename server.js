require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const config = require("./config");
const watchRoutes = require("./routes/watch/watch.routes");
const customerRoutes = require("./routes/user/customer.routes");
const authRoutes = require("./routes/auth/auth.routes");
const orderRoutes = require("./routes/order/order.routes");
const uploadRoutes = require("./routes/upload/upload.routes");
const errorHandler = require("./middleware/errorHandler");
const db = require("./database/mongoose");
const mongoose = require("mongoose");
const {connectGridFS} = require("./config/gridfs")

// ENABLE CORS
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,PATCH,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));

app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use("/api/watches", watchRoutes);
app.use("/api/customers", customerRoutes);  
app.use("/api/auth", authRoutes); 
app.use("/api/order", orderRoutes); 
app.use("/api/media", uploadRoutes); 


// Health check
app.get("/", (req, res) => {
  res.send("API Running");
});

// Error handler
app.use(errorHandler);

const startServer = async () => {
  try {
    await db.connect();
    const port = process.env.PORT || config.port || 5000;

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    mongoose.connection.once("open", () => {
      connectGridFS();
      console.log("Connected to GridFS");
    })

  } catch (error) {
    console.error("Failed to start server", error);
  }
};

startServer();
