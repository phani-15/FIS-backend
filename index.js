import 'dotenv/config'
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors"
import authRoutes from "./routes/auth.js"
import personalRoutes from "./routes/personal.js"
import PDFDocument from "pdfkit";

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

app.get("/download-profile", (req, res) => {

  const faculty = {
    name: "Dr. Jane Doe",
    designation: "Professor",
    department: "Computer Science",
    email: "jane.doe@university.edu",
    qualifications: "Ph.D., M.Tech, B.Tech",
  };

  // Create PDF
  const doc = new PDFDocument({
    size: "A4",
    margin: 50
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=profile.pdf");

  doc.pipe(res);

  // -------- HEADER --------
  doc
    .fontSize(26)
    .fillColor("#0A3D62")
    .text("FACULTY PROFILE", { align: "center" })
    .moveDown(1);

  // Line separator
  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .strokeColor("#0A3D62")
    .stroke()
    .moveDown(1);

  // -------- PROFILE SECTION BOX --------
  doc
    .fontSize(14)
    .fillColor("black");

  const startY = doc.y;

  // Draw border box
  doc
    .rect(50, startY, 500, 150)
    .strokeColor("#333")
    .stroke();

  doc
    .fontSize(16)
    .fillColor("#0A3D62")
    .text("Personal Details", 60, startY + 10);

  doc
    .fontSize(13)
    .fillColor("black")
    .moveDown();

  doc.text(`Name: ${faculty.name}`, 60, startY + 40);
  doc.text(`Designation: ${faculty.designation}`, 60, startY + 65);
  doc.text(`Department: ${faculty.department}`, 60, startY + 90);
  doc.text(`Email: ${faculty.email}`, 60, startY + 115);

  doc.moveDown(6);

  // -------- QUALIFICATIONS SECTION --------
  doc
    .fontSize(16)
    .fillColor("#0A3D62")
    .text("Qualifications");

  doc
    .moveDown(0.5)
    .fontSize(13)
    .fillColor("black")
    .text(faculty.qualifications, {
      align: "left",
      width: 500
    });

  // End PDF
  doc.end();
});

const port = process.env.port || 5000

app.listen(port, () => console.log(`Server running on port ${port}`));