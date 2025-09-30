// install: npm install express pdfkit
import express from "express";
import PDFDocument from "pdfkit";

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to the Faculty Profile PDF Generator!");
});

//hey vinay common 

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

app.listen(3000, () => console.log("Server running on port 3000"));