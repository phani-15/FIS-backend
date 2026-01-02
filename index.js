import 'dotenv/config'
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import HodRoutes from "./routes/hod.js"
import personalRoutes from "./routes/personal.js";
import DetailsRoutes from "./routes/addDetails.js"
import IqacRoutes from "./routes/iqac.js"
import AdminRoutes from './routes/admin.js'
import path from "path"
const app = express();

//middleWares
app.use(bodyParser.json())
app.use(cookieParser())
// ---------------- DB CONNECTION ----------------
mongoose.connect(process.env.DATABASE)
.then(() => console.log("DB Connected"))
.catch(err => console.log("Error connecting to DB", err));

// ---------------- MIDDLEWARES ----------------

// ❗ IMPORTANT: CORS must allow credentials + your frontend origin
app.use(cors({
  origin: "http://localhost:5173", // 👈 EXACT frontend origin
  credentials: true,               // 👈 REQUIRED
})); 

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(bodyParser.json());
app.use(cookieParser());

// ---------------- ROUTES ----------------
app.use("/api", authRoutes);
app.use("/api", personalRoutes);
app.use("/api", HodRoutes);
app.use("/api", DetailsRoutes);
app.use("/api", IqacRoutes);
app.use('/api',AdminRoutes)

// Test route
app.get("/", (req, res) => {
  res.send("hello from the server");
});

// ---------------- START SERVER ----------------
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
