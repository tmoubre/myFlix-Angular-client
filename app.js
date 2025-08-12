// server/index.js (or app.js)
import express from "express";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: ["http://localhost:4200"], // add your prod origin here later
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false, // true only if you use cookies
};

app.use(cors(corsOptions));
// Handle preflight for all routes
app.options("*", cors(corsOptions));

app.use(express.json());

// ... your routes, e.g.:
app.post("/login", (req, res) => {
  // login logic
});
