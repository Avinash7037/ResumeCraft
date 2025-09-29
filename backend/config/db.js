import mongoose from "mongoose";

export const connnectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://avinash_:1234567890@cluster0.9papivw.mongodb.net/Resume"
    )
    .then(() => console.log("DB CONNECTED"));
};
