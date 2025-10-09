import mongoose from "mongoose";
const adddetails = new mongoose.Schema({

})

const journalSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    title_of_the_paper:  {
        type:String,
        required:true
    },
    name_of_the_journal:  {
        type:String,
        required:true
    },
    page_number:  {
        type:Number,
        required:true
    },
    year: {
        type:Number,
        required:true
    },
    ISSN_Number:  {
        type:Number,
        required:true
    },
    Impact_Factor:  {
        type:String,
        required:true
    },
    national_or_International:  {
        type:Boolean,
        required:true
    },
    document: {
        type:String,
        required:true
    }
})
const journal = mongoose.model("Journal", journalSchema)

const conferencesSchema = new mongoose.Schema({
    name:  {
        type:String,
        required:true
    },
    title_of_the_paper:  {
        type:String,
        required:true
    },
    title_of_conference:  {
        type:String,
        required:true
    },
    year: {
        type:String,
        required:true
    },
    organized_by:  {
        type:String,
        required:true
    },
    national_or_international:  {
        type:Boolean,
        required:true
    },
    document:  {
        type:String,
        required:true
    }
})
const Conference = mongoose.model("Conference", conferencesSchema)

const seminarSchema = new mongoose.Schema({
    name:  {
        type:String,
        required:true
    },
    title_of_the_paper: {
        type:String,
        required:true
    },
    title_of_seminar:  {
        type:String,
        required:true
    },
    year:  {
        type:String,
        required:true
    },
    organized_by:  {
        type:String,
        required:true
    },
    national_international:  {
        type:Boolean,
        required:true
    },
    document:  {
        type:String,
        required:true
    }
})
const Seminar = mongoose.model("Seminar", seminarSchema)

const researchSchema = new mongoose.Schema({
    name:  {
        type:String,
        required:true
    },
    year:  {
        type:String,
        required:true
    },
    name_of_the_principal_investigator:  {
        type:String,
        required:true
    },
    duration_of_project:  {
        type:String,
        required:true
    },
    name_of_research_project:  {
        type:String,
        required:true
    },
    fund_recieved:  {
        type:Number,
        required:true
    },
    name_of_funding_agency:  {
        type:String,
        required:true
    },
    year_of_sanction:  {
        type:Number,
        required:true
    },
    Department_of_recipient:  {
        type:String,
        required:true
    },
    document:  {
        type:String,
        required:true
    },
})
const Research = mongoose.model("Research", researchSchema)

const certificationSchema = new mongoose.Schema({
    name:  {
        type:String,
        required:true
    },
    name_of_certification_course:  {
        type:String,
        required:true
    },
    organized_by:  {
        type:String,
        required:true
    },
    duration:  {
        type:String,
        required:true
    },
    certificate:  {
        type:String,
        required:true
    }
})
const Certification = mongoose.model("Certification", certificationSchema)

const bookSchema = new mongoose.Schema({
    name:  {
        type:String,
        required:true
    },
    title_of_the_book:  {
        type:String,
        required:true
    },

    name_of_the_publisher:  {
        type:String,
        required:true
    },
    year:  {
        type:String,
        required:true
    },
    ISBN_DOI_number:  {
        type:String,
        required:true
    },
    national_or_international:  {
        type:Boolean,
        required:true
    },
    document:  {
        type:String,
        required:true
    }
})
const Book = mongoose.model("Book", bookSchema)

const book_chapterSchema = new mongoose.Schema({
    name:  {
        type:String,
        required:true
    },
    title_of_the_book:  {
        type:String,
        required:true
    },
    name_of_the_publisher:  {
        type:String,
        required:true
    },
    year:  {
        type:String,
        required:true
    },
    ISBN_DOI_number:  {
        type:String,
        required:true
    },
    national_or_international:  {
        type:Boolean,
        required:true
    },
    document:  {
        type:String,
        required:true
    }
})
const BookChapter = mongoose.model("BookChapter", book_chapterSchema)

const sponsored_projectSchema = new mongoose.Schema({
    name:  {
        type:String,
        required:true
    },
    project_title:  {
        type:String,
        required:true
    },
    funding_details:  {
        type:String,
        required:true
    },
    amount:  {
        type:Number,
        required:true
    },
    duration:  {
        type:String,
        required:true
    },
    academic_year:  {
        type:String,
        required:true
    },
    certificate:  {
        type:Buffer,
        required:true
    },
})
const Sponsoredproject = mongoose.model("SponsoredProject", sponsored_projectSchema)


module.exports = {
    journal,
    Conference,
    Seminar,
    Research,
    Certification,
    Book,
    BookChapter,
    Sponsoredproject
}