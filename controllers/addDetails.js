import expess from "express"
import Credential from "../modals/AddDetails.js"
import { fileFIelds } from "../utils/multer.js"
import { login } from "./auth.js"

export const getCredentialById = async (req, res, next, id) => {
    const cred = await Credential.findById(id)
    if (!cred) {
        return res.status(400).json({
            error: "no cred was found by the given ID"
        })
    }
    req.credential = cred
    next();
}
export const createCredential = async (req, res) => {
    const { group, subcategory, formdata } = req.body
    const parsedData = JSON.parse(formdata)

    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const baseField = /^(document|proceeding|allotment_order)(__\d+)?$/.test(file.fieldname) ? file.fieldname.split("__")[0] : file.fieldname;
            if (fileFIelds.has(baseField)) {
                (parsedData[baseField] = file.filename);
            }
        }
    }
    const updatedcred = await Credential.findByIdAndUpdate(req.credential._id.toString(), {
        $push: { [subcategory ? subcategory : group]: parsedData }
    }, { new: true })
    if (!updatedcred) {
        return res.status(400).json({
            error: "there was an error on updating the Credentials"
        })
    }
    res.json(updatedcred)
}

export const getCredDetails = (req, res) => {
    const sendingObj = { role: req.auth.role }
    for (const [key, value] of Object.entries(req.credential.toObject())) {
        if (Array.isArray(value) && value.length > 0) {
            sendingObj[key] = value
        }
    }
    res.json(sendingObj)
}