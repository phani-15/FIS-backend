import mongoose from 'mongoose';
import  {v4} from "uuid"
const {createHmac} = await import('node:crypto');

const facultySchema = new mongoose.Schema({
    email : { type: String, required: true, unique: true },
    encry_password : { type: String, required: true },
    phone : { type: String, required: true,unique:true},
    salt:String
},{timestamps:true})


//this is all for encryption 

facultySchema.virtual("password")
    .set(function(password){
        this._password=password
        this.salt=v4()
        this.encry_password=this.encryptPassword(password)
    })
    .get(function(){
        return this._password
    })

facultySchema.methods={
    authenticate:function(password){
        return this.encryptPassword(password)==this.encry_password
    },
    encryptPassword:function(password){
        if(!password || !this.salt) return "";
        try {
            return createHmac('sha256',this.salt)
            .update(password)
            .digest('hex')
        } catch (error) {
            
        }
        
    }
}

export default mongoose.model("Faculty", facultySchema);