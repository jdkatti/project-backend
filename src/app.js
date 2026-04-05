const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

const auth = require("./middleware/authMiddleware");
const role = require("./middleware/roleMiddleware");

app.get("/api/admin-only", auth, role("ADMIN"), (req, res) => {
  res.json({message: "Welcome admin"});
});

app.get("/api/test", auth, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user
  });
});

// Test route
app.get("/", (req, res) => {
  res.send("Server is up and running ");
});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database Connected");

    // Start server
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database Connection Error:", err);
  });

app.use("/api/auth", require("./routes/auth.routes"));

app.use("/api/transactions", require("./routes/transaction.routes"));

app.use("/api/dashboard", require("./routes/dashboard.routes"));

app.use("/api/users", require("./routes/user.routes"));

