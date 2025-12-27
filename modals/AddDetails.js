import mongoose, { mongo } from "mongoose";
import { dash } from "pdfkit";


//need to check the Document Section in everything need to add constraints
const JournalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    title_of_the_paper: {
        type: String,
        required: true
    },
    name_of_the_journal: {
        type: String,
        required: true
    },
    page_number: {
        type: Number,
        required: true,
        max: 4
    },
    year: {
        type: Number,
        required: true,
        max: new Date().getFullYear()
    },
    ISSN_Number: {
        type: Number,
        required: true,
        unique: true,
        max: 9,
        trim: true
    },
    Impact_Factor: {
        type: String,
        required: true
    },
    national_or_International: {
        type: Boolean,
        required: true
    },
    document: {
        type: String,
        required: true
    }
})
const Journal = mongoose.model("Journal", JournalSchema)

const ConferencesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    title_of_the_paper: {
        type: String,
        required: true,
        trim: true
    },
    title_of_conference: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear()
    },
    organized_by: {
        type: String,
        required: true,
        trim: true
    },
    national_or_international: {
        type: Boolean,
        required: true
    },
    document: {
        type: String,
        required: true
    }
}, { timestamps: true })
const Conference = mongoose.model("Conference", ConferencesSchema)

const SeminarSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    title_of_the_paper: {
        type: String,
        required: true,
        trim: true
    },
    title_of_seminar: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true,
        minchar: 4,
        max: new Date().getFullYear()
    },
    organized_by: {
        type: String,
        required: true
    },
    national_international: {
        type: Boolean,
        required: true
    },
    document: {
        type: String,
        required: true
    }
}, { timestamps: true })
const Seminar = mongoose.model("Seminar", SeminarSchema)

const ResearchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true,
        minchar: 4,
        max: new Date().getFullYear()
    },
    name_of_the_principal_investigator: {
        type: String,
        required: true
    },
    //need to do this
    duration_of_project: {
        type: Number,
        required: true,
        minchar: 1
    },
    name_of_research_project: {
        type: String,
        required: true
    },
    fund_recieved: {
        type: Number,
        required: true,
        minchar: 2
    },
    name_of_funding_agency: {
        type: String,
        required: true,
        trim: true
    },
    year_of_sanction: {
        type: Number,
        required: true,
        max: new Date().getFullYear()
    },
    Department_of_recipient: {
        type: String,
        required: true
    },
    document: {
        type: String,
        required: true
    },
}, { timestamps: true })
const Research = mongoose.model("Research", ResearchSchema)

const CertificationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    name_of_certification_course: {
        type: String,
        required: true
    },
    organized_by: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        minchar: 1
    },
    certificate: {
        type: String,
        required: true
    }
}, { timestamps: true })
const Certification = mongoose.model("Certification", CertificationSchema)

const BookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    title_of_the_book: {
        type: String,
        required: true,
        trim: true
    },

    name_of_the_publisher: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true,
        max: new Date().getFullYear()
    },
    ISBN_DOI_number: {
        unique: true,
        type: String,
        required: true,
        trim: true
    },
    national_or_international: {
        type: Boolean,
        required: true
    },
    document: {
        type: String,
        required: true
    }
}, { timestamps: true })
const Book = mongoose.model("Book", BookSchema)

const BookChapterSchema = new mongoose.Schema({
    title_of_the_BC: { type: String, required: true },
    title_of_the_BC: { type: String, required: true },
    name_of_the_publisher: { type: String, required: true },
    year: { type: Number, required: true, max: new Date().getFullYear() },
    ISBN_DOI_number: { type: String, unique: true, required: true, trim: true },
    national_or_international: { type: Boolean, required: true },
    document: { type: String, required: true }
}, { timestamps: true })
const BookChapter = mongoose.model("BookChapter", BookChapterSchema)

const SponsoredProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    project_title: {
        type: String,
        required: true
    },
    funding_details: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        minchar: 2
    },
    duration: {
        type: Number,
        required: true,
        minchar: 1
    },
    academic_year: {
        type: Number,
        required: true,
        minchar: 4,
        max: new Date().getFullYear()
    },
    certificate: {
        type: Buffer,
        required: true
    },
}, { timestamps: true })
const Sponsoredproject = mongoose.model("SponsoredProject", SponsoredProjectSchema)

const ForeignSchema = new mongoose.Schema({
    Purpose_of_Visit: { type: String, required: true },
    Nature_of_Visit: { type: String, required: true },
    Name_of_Conference: { type: String, required: true },
    Academic_Year: { type: Date(), required: true }, //need to check once 
    Name_of_Host_Organization: { type: String, required: true },
    Country_Visited: { type: String, required: true },
    Start_Date: { type: Date(), required: true }, //need to check once 
    End_Date: { type: Date(), required: true }, //need to check once 
    Duration: { type: Number, required: true },
    Role_of_Faculty: { type: String, required: true },
    Title_of_the_Paper: { type: String, required: true },
    Sponsoring_Agency: { type: String, required: true },
    Amount_Sanctioned: { type: Number, required: true },
    Travel_Grant_Recieved: { type: String, required: true },
    document: { type: String, required: true }
})
const ForeignSchema_visits = mongoose.model("Foreign_Visits", ForeignSchema)

const PatentsSchema = new mongoose.Schema({
    Patent_Number: { type: String, required: true },
    Title_of_the_Patent: { type: String, required: true },
    Published: { type: String, enum: ["granted", "published"], required: true, default: "published" },
    Year_of_Published: { type: Number, required: true },
    Scope: { type: String, required: true },
    Document: { type: String, required: true, default: "" }
})
const Patents = mongoose.model("Patents", PatentsSchema)


module.exports = {
    Journal,
    Conference,
    Seminar,
    Research,
    Certification,
    Book,
    BookChapter,
    Sponsoredproject
}