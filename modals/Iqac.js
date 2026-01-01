import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { createHmac } from "crypto";

const IqacSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    unique: true,
    enum: [
      "Principal",
      "Vice Principal",
      "IQAC Coordinator",
      "IQAC Director",
      "R&D Director"
    ]
  },

  encry_password: {
    type: String,
    required: true
  },

  salt: {
    type: String
  }
});
IqacSchema.virtual("passcode")
  .set(function (passcode) {
    this._passcode = passcode;
    this.salt = uuidv4();
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
    } catch (err) {
      return "";
    }
  }
};

export default mongoose.model("IQAC", IqacSchema);
