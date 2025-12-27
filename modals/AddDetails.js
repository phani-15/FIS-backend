import mongoose from "mongoose";

//need to check the Document Section in everything need to add constraints
// const JournalSchema = new mongoose.Schema([{
//     "Title of the Paper": "IoT for Healthcare",
//     "Name of the Journal": "Journal of Smart Systems",
//     "Page Number": "45-52",
//     "Year of Publication": "2024",
//     "Volume Number": "18",
//     "Impact Factor (Thomson Reuters)": "3.2",
//     "National/International": "International",
//     "ISSN Number": "2456-1234",
//     "No.of Authors": "4",
//     "Author": "First Author",
//     "Indexing Platform": "Scopus",
//     "H-index": "12",
//     "Document": "journal_paper1.pdf"
// }])

// const ConferencesSchema = new mongoose.Schema([{
//     "Title of the Paper": "Blockchain in Education",
//     "Title of the Conference": "IEEE International Conference on Emerging Tech",
//     "Date of Publication": "2023-11-05",
//     "Organized by": "IEEE",
//     "National/International": "International",
//     "Document": "conference_paper1.pdf"
// }, { timestamps: true }])

// const SeminarSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     title_of_the_paper: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     title_of_seminar: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     year: {
//         type: Number,
//         required: true,
//         minchar: 4,
//         max: new Date().getFullYear()
//     },
//     organized_by: {
//         type: String,
//         required: true
//     },
//     national_international: {
//         type: Boolean,
//         required: true
//     },
//     document: {
//         type: String,
//         required: true
//     }
// }, { timestamps: true })

// const ResearchSchema = new mongoose.Schema([{
//     "Project Title": "Smart Agriculture Platform",
//     "Year of Sanction": "2022",
//     "Duration ": "18 months",
//     "Funding Agency": "UGC",
//     "Sanctioned Amount": "300000",
//     "Recieved Amount (utilized)": "200000",
//     "Are you": "Co-Principal Investigator",
//     "Status": "Ongoing",
//     "Sanctioning Order": "sanction_research.pdf",
//     "Utilization Certificate (final year)": "uc_not_submitted.pdf"
// }, { timestamps: true }])

// const CertificationSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     name_of_certification_course: {
//         type: String,
//         required: true
//     },
//     organized_by: {
//         type: String,
//         required: true
//     },
//     duration: {
//         type: Number,
//         required: true,
//         minchar: 1
//     },
//     certificate: {
//         type: String,
//         required: true
//     }
// }, { timestamps: true })

// const BookSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     title_of_the_book: {
//         type: String,
//         required: true,
//         trim: true
//     },
    
//     name_of_the_publisher: {
//         type: String,
//         required: true
//     },
//     year: {
//         type: Number,
//         required: true,
//         max: new Date().getFullYear()
//     },
//     ISBN_DOI_number: {
//         unique: true,
//         type: String,
//         required: true,
//         trim: true
//     },
//     national_or_international: {
//         type: Boolean,
//         required: true
//     },
//     document: {
//         type: String,
//         required: true
//     }
// }, { timestamps: true })

// const BookChapterSchema = new mongoose.Schema([{
//     "Title of the Book Chapter": "Advances in Deep Learning",
//     "Name of the Publisher": "Springer",
//     "Year of Publication": "2023",
//     "National/International": "International",
//     "ISBN Number": "978-3-030-12345-6",
//     "No. of Authors": "3",
//     "Document": "book_chapter_doc.pdf"
// }, { timestamps: true }])

// const SponsoredProjectSchema = new mongoose.Schema([{
//     "Project Title": "AI-based Traffic Monitoring",
//     "Funding Agency": "SERB",
//     "Amount (in INR)": "500000",
//     "Duration (in months)": "24",
//     "Academic Year": "2023-24",
//     "Are you": "Principal Investigator",
//     "Status": "Ongoing",
//     "Sanctioning Order": "sanction_order_ai.pdf",
//     "Utilization Certificate (final year)": "uc_pending.pdf"
// }], { timestamps: true })

// const ForeignSchema = new mongoose.Schema([{
//     Purpose_of_Visit: { type: String, required: true },
//     Nature_of_Visit: { type: String, required: true },
//     Name_of_Conference: { type: String, required: true },
//     Academic_Year: { type: Date(), required: true }, //need to check once 
//     Name_of_Host_Organization: { type: String, required: true },
//     Country_Visited: { type: String, required: true },
//     Start_Date: { type: Date(), required: true }, //need to check once 
//     End_Date: { type: Date(), required: true }, //need to check once 
//     Duration: { type: Number, required: true },
//     Role_of_Faculty: { type: String, required: true },
//     Title_of_the_Paper: { type: String, required: true },
//     Sponsoring_Agency: { type: String, required: true },
//     Amount_Sanctioned: { type: Number, required: true },
//     Travel_Grant_Recieved: { type: String, required: true },
//     document: { type: String, required: true }
// }])

// const PatentsSchema = new mongoose.Schema([{
//     Patent_Number: { type: String, required: true },
//     Title_of_the_Patent: { type: String, required: true },
//     Published: { type: String, enum: ["granted", "published"], required: true, default: "published" },
//     Year_of_Published: { type: Number, required: true },
//     Scope: { type: String, required: true },
//     Document: { type: String, required: true, default: "" }
// }])

// const nptelSchema = new mongoose.Schema([{
//     "Name of Certification Course": "Machine Learning",
//     "Type of Certification": "Elite",
//     "Duration (in weeks)": "12",
//     "certificate": "nptel_ml_cert.pdf"
// }])

// const consultancySchema=new mongoose.Schema([{
//     "Project Title": "Industrial Automation Consultancy",
//     "Year of Sanction": "2023",
//     "Duration ": "12 months",
//     "Funding Agency": "XYZ Industries",
//     "Amount (in INR)": "150000",
//     "Are you ": "Consultant",
//     "Status": "Completed",
//     "Sanctioning Order": "consultancy_order.pdf",
//     "Utilization Certificate (final year)": "consultancy_uc.pdf"
// }],{timestamps:true})

// const fdpSchema=new mongoose.Schema([{
//     "Program Title": "FDP on Data Science",
//     "Starting Date": "2024-01-05",
//     "Ending Date": "2024-01-10",
//     "Scope": "National",
//     "Organizing Body": "IIT Delhi",
//     "Mode": "Online",
//     "Place": "Delhi",
//     "Attended/Organized": "Attended",
//     "Role": "Participant"
// }],{timestamps:true})

// const talkSchema=new mongoose.Schema([{
//     "Event Title": "Guest Lecture on AI",
//     "Name of the Event": "Tech Talk Series",
//     "Date": "2024-03-15",
//     "Topic / Title of Talk": "AI for Everyone",
//     "Scope": "Institutional",
//     "Mode": "Offline",
//     "Place": "College Auditorium",
//     "Document": "talk_certificate.pdf"
// }],{timestamps:true})

// const awaradSchema=new mongoose.Schema([{
//     "Award / Recognition Title": "Best Researcher Award",
//     "Granting Organization / Institution": "ABC University",
//     "Scope": "University",
//     "Year": "2023",
//     "Document": "award_doc.pdf"
// }],{timestamps:true})

// const ieeeSchema=new mongoose.Schema([{
//     "Membership ID": "IEEE123456",
//     "Membership Type": "Professional Member",
//     "Year Joined": "2022",
//     "Validity Period (if applicable)": "2025",
//     "Document": "ieee_membership.pdf"
// }],{timestamps:true})



// const Sponsoredproject = mongoose.model("SponsoredProject", SponsoredProjectSchema)
// const Book = mongoose.model("Book", BookSchema)
// const Journal = mongoose.model("Journal", JournalSchema)
// const Conference = mongoose.model("Conference", ConferencesSchema)
// const Seminar = mongoose.model("Seminar", SeminarSchema)
// const BookChapter = mongoose.model("BookChapter", BookChapterSchema)
// const consultancy=mongoose.model("Consultancy",consultancySchema)
// const Patents = mongoose.model("Patents", PatentsSchema)
// const nptel = mongoose.model("Nptel", nptelSchema)
// const ForeignSchema_visits = mongoose.model("Foreign_Visits", ForeignSchema)
// const Certification = mongoose.model("Certification", CertificationSchema)
// const award=mongoose.model("Award",awaradSchema)
// const Research = mongoose.model("Research", ResearchSchema)
// const ieee=mongoose.model("IEEE",ieeeSchema)
// const talk=mongoose.model("Talk",talkSchema)
// const fdp=mongoose.model("Fdp",fdpSchema)


const finalDetails=new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Faculty",
    required:true
  },
  foreign_visits: {type:Array,default:[]},
  patents:{type:Array,default:[]},  
  book_chapter: {type:Array,default:[]},
  book: {type:Array,default:[]},
  journal:{type:Array,default:[]},
  conference_paper:{type:Array,default:[]},
  nptel:{type:Array,default:[]},
  swayam: {type:Array,default:[]},
  coursera: {type:Array,default:[]},
  infosysspringboard:{type:Array,default:[]},
  edx: {type:Array,default:[]},
  other:{type:Array,default:[]},
  sponsored: {type:Array,default:[]},
  research:{type:Array,default:[]},
  consultancy:{type:Array,default:[]},
  fdp: {type:Array,default:[]},
  sttp:{type:Array,default:[]},
  conference: {type:Array,default:[]},
  workshop: {type:Array,default:[]},
  seminar: {type:Array,default:[]},
  webinar: {type:Array,default:[]},
  RC: {type:Array,default:[]},
  OC:{type:Array,default:[]},
  talk: {type:Array,default:[]},
  keynote: {type:Array,default:[]},
  chair:{type:Array,default:[]},
  lecture:{type:Array,default:[]},
  resource_person: {type:Array,default:[]},
  mooc_content: {type:Array,default:[]},
  e_content:{type:Array,default:[]},
  innovative_pedagogy:{type:Array,default:[]},
  award_title: {type:Array,default:[]},
  ieee:{type:Array,default:[]},
  acm:{type:Array,default:[]},
  csi: {type:Array,default:[]},
  ie:{type:Array,default:[]},
  iete:{type:Array,default:[]},
  other_bodies:{type:Array,default:[]},
  any_moocs_course: {type:Array,default:[]},
  book_book_chapter:{type:Array,default:[]},
  phd_awarded:{type:Array,default:[]},
  phd_ongoing: {type:Array,default:[]},
  mtech:{type:Array,default:[]}
})

// module.exports = {
//     Journal,
//     Conference,
//     Seminar,
//     Research,
//     Certification,
//     Book,
//     BookChapter,
//     Sponsoredproject
// }

export default mongoose.model("Credentials",finalDetails)