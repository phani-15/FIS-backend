import mongoose from "mongoose";
import { v4 } from "uuid";
const { createHmac } = await import("node:crypto");

const IqacSchema = new mongoose.Schema({
  role: {type: String,required: true,default: "IQAC"},
  encry_password: {type: String,required: true},
  salt: {type: String}
});

IqacSchema.virtual("passcode")
  .set(function (passcode) {
    this._passcode = passcode;
    this.salt = v4();
    this.encry_password = this.encryptPassword(passcode);
  })
  .get(function () {
    return this._passcode;
  });

IqacSchema.methods = {
  authenticate: function (passcode) {
    return this.encryptPassword(passcode) === this.encry_password;
  },

  encryptPassword: function (passcode) {
    if (!passcode || !this.salt) return "";

    try {
      return createHmac("sha256", this.salt)
        .update(passcode)
        .digest("hex");
    } catch (error) {
      return "";
    }
  }
};

export default mongoose.model("IQAC", IqacSchema);
