import 'dotenv/config'
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import personalRoutes from "./routes/personal.js";

const app = express();

// ---------------- DB CONNECTION ----------------
mongoose.connect(process.env.DATABASE)
.then(() => console.log("DB Connected"))
.catch(err => console.log("Error connecting to DB", err));

// ---------------- MIDDLEWARES ----------------

// ❗ IMPORTANT: CORS must allow credentials + your frontend origin
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow non-browser tools like Postman
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));


app.use(bodyParser.json());
app.use(cookieParser());

// ---------------- ROUTES ----------------
app.use("/api", authRoutes);
app.use("/api", personalRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("hello from the server");
});

// ---------------- START SERVER ----------------
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
