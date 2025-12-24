import mongoose from "mongoose";
const {createHmac} = await import('node:crypto');
import {v4} from "uuid"
const hodSchema=new mongoose.Schema({
    email:{type:String,required:true},
    department:{type:String,required:true},
    encry_password:{type:String,required:true},
    salt:String     
})

hodSchema.virtual("password")
    .set(function(password){
        this._password=password
        this.salt=v4()
        this.encry_password=this.encryptPassword(password)
    })
    .get(function(){
        return this._password
    })

hodSchema.methods={
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

export default mongoose.model("HOD",hodSchema)