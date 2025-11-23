import 'dotenv/config'
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors"


import authRoutes from "./routes/auth.js"
import personalRoutes from "./routes/personal.js"

const app = express();

mongoose.connect(process.env.DATABASE, {
}).then(() => {
  console.log("DB Connected");
}).catch(err=>{
  console.log("error occured in connecting to DB ");
  
})

//middleWares
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

//routes
app.use("/api",authRoutes)
app.use("/api",personalRoutes)
// app.use("/api",PersonalRoutes)



//hey vinay common 
app.get('/',(req,res)=>{
  res.send("hello from the Db")
})

// app.get("/download-profile", (req, res) => {

//   const faculty = {
//     name: "Dr. Jane Doe",
//     designation: "Professor",
//     department: "Computer Science",
//     email: "jane.doe@university.edu",
//     qualifications: "Ph.D., M.Tech, B.Tech",
//   };

//   // Create PDF
//   const doc = new PDFDocument();
//   res.setHeader("Content-Type", "application/pdf");
//   res.setHeader("Content-Disposition", "attachment; filename=profile.pdf");

//   doc.pipe(res);

//   doc.fontSize(20).text("Faculty Profile", { align: "center" });
//   doc.moveDown();

//   doc.fontSize(14).text(`Name: ${faculty.name}`);
//   doc.text(`Designation: ${faculty.designation}`);
//   doc.text(`Department: ${faculty.department}`);
//   doc.text(`Email: ${faculty.email}`);
//   doc.text(`Qualifications: ${faculty.qualifications}`);

//   doc.end();
// });

const port = process.env.port || 5000

app.listen(port, () => console.log(`Server running on port ${port}`));