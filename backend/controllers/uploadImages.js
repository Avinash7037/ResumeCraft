// controllers/uploadImages.js
import fs from "fs";
import path from "path";
import Resume from "../models/resumeModel.js";

export const uploadResumeImages = async (req, res) => {
  try {
    const resumeId = req.params.id;
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user._id,
    });

    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found or unauthorized" });
    }

    const uploadsFolder = path.join(process.cwd(), "uploads");
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const newThumbnail = req.files?.thumbnail?.[0];
    const newProfileImage = req.files?.profileImage?.[0];

    // Replace old thumbnail
    if (newThumbnail) {
      if (resume.thumbnailLink) {
        const oldThumbnail = path.join(
          uploadsFolder,
          path.basename(resume.thumbnailLink)
        );
        if (fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
      }
      resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
    }

    // Replace old profile image
    if (newProfileImage) {
      if (resume.profileInfo?.previewUrl) {
        const oldProfile = path.join(
          uploadsFolder,
          path.basename(resume.profileInfo.previewUrl)
        );
        if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
      }
      resume.profileInfo = resume.profileInfo || {};
      resume.profileInfo.previewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
    }

    await resume.save();

    res.status(200).json({
      message: "Image(s) uploaded successfully",
      thumbnailLink: resume.thumbnailLink,
      previewUrl: resume.profileInfo.previewUrl,
    });
  } catch (err) {
    console.error("Error uploading images:", err);
    res
      .status(500)
      .json({ message: "Failed to upload image", error: err.message });
  }
};
