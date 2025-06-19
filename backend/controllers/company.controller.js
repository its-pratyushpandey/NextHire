// Imports
import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Register company
export const registerCompany = async (req, res) => {
    const { companyName } = req.body;
    if (!companyName) {
        return res.status(400).json({ success: false, message: "Company name is required" });
    }
    const existing = await Company.findOne({ name: companyName });
    if (existing) {
        return res.status(400).json({ success: false, message: "Company already exists" });
    }
    let company = await Company.create({
        name: companyName,
        userId: req.id
    });

    return res.status(201).json({
        message: "Company registered successfully.",
        company,
        success: true
    })
}
// Get all companies for user
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// Get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// Update company
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const updateData = { name, description, website, location };

        // File upload
        if (req.file) {
            const fileUri = getDataUri(req.file);
            if (fileUri) {
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                updateData.logo = cloudResponse.secure_url;
            }
        }

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated.",
            company,
            success: true
        });

    } catch (error) {
        console.error('Error updating company:', error);
        return res.status(500).json({
            message: "Failed to update company information.",
            success: false,
            error: error.message
        });
    }
}