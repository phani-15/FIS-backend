import mongoose from "mongoose";
import { v4 } from "uuid";
const { createHmac } = await import("node:crypto");

const adminSchema = new mongoose.Schema({
  role: { type: String, default: "ADMIN" },
  encry_password: { type: String, required: true },
  salt: String
});

adminSchema.virtual("passCode")
  .set(function(passCode){
    this._password = passCode;
    this.salt = v4();
    this.encry_password = this.encryptPassword(passCode);
  })
  .get(function(){
    return this._password;
  });

adminSchema.methods = {
  authenticate: function(password){
    return this.encryptPassword(password) === this.encry_password;
  },
  encryptPassword: function(password){
    if(!password || !this.salt) return "";
    try {
      return createHmac('sha256', this.salt)
        .update(password)
        .digest('hex');
    } catch {
      return "";
    }
  }
};

export default mongoose.model("Admin", adminSchema);
