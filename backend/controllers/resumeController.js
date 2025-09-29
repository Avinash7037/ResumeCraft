import Resume from "../models/resumeModel.js";
import fs from "fs";
import path from "path";

/**
 * ✅ Create Resume
 */
export const createResume = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Default template
    const defaultResumeData = {
      profileInfo: {
        profileImg: null,
        previewUrl: "",
        fullName: "",
        designation: "",
        summary: "",
      },
      contactInfo: {
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        website: "",
      },
      workExperience: [
        {
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      education: [
        {
          degree: "",
          institution: "",
          startDate: "",
          endDate: "",
        },
      ],
      skills: [
        {
          name: "",
          progress: 0,
        },
      ],
      projects: [
        {
          title: "",
          description: "",
          github: "",
          liveDemo: "",
        },
      ],
      certifications: [
        {
          title: "",
          issuer: "",
          year: "",
        },
      ],
      languages: [
        {
          name: "",
          progress: "",
        },
      ],
      interests: [""],
    };

    // Merge user input safely with default template
    const newResume = await Resume.create({
      userId: req.user._id,
      title,
      ...defaultResumeData,
      ...req.body,
    });

    res.status(201).json(newResume);
  } catch (error) {
    console.error("❌ Error in createResume:", error);
    res.status(500).json({
      message: "Failed to create resume",
      error: error.message,
    });
  }
};

/**
 * ✅ Get all user resumes
 */
export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({
      updatedAt: -1,
    });

    res.json(resumes);
  } catch (error) {
    console.error("❌ Error in getUserResumes:", error);
    res.status(500).json({
      message: "Failed to get resumes",
      error: error.message,
    });
  }
};

/**
 * ✅ Get resume by Id
 */
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json(resume);
  } catch (error) {
    console.error("❌ Error in getResumeById:", error);
    res.status(500).json({
      message: "Failed to get resume",
      error: error.message,
    });
  }
};

/**
 * ✅ Update resume
 */
export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found or not authorized" });
    }

    // Merge updates safely
    Object.assign(resume, req.body);
    const savedResume = await resume.save();

    res.json(savedResume);
  } catch (error) {
    console.error("❌ Error in updateResume:", error);
    res.status(500).json({
      message: "Failed to update resume",
      error: error.message,
    });
  }
};

/**
 * ✅ Delete resume
 */
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found or not authorized" });
    }

    const uploadsFolder = path.join(process.cwd(), "uploads");

    // Delete thumbnail if exists
    if (resume.thumbnailLink) {
      const oldThumbnail = path.join(
        uploadsFolder,
        path.basename(resume.thumbnailLink)
      );
      if (fs.existsSync(oldThumbnail)) {
        fs.unlinkSync(oldThumbnail);
      }
    }

    // Delete profile preview if exists
    if (resume.profileInfo?.previewUrl) {
      const oldProfile = path.join(
        uploadsFolder,
        path.basename(resume.profileInfo.previewUrl)
      );
      if (fs.existsSync(oldProfile)) {
        fs.unlinkSync(oldProfile);
      }
    }

    // Delete resume document
    await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("❌ Error in deleteResume:", error);
    res.status(500).json({
      message: "Failed to delete resume",
      error: error.message,
    });
  }
};
