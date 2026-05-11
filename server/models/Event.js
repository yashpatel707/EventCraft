import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: String,
    place: String,
    price: Number,
    image: String,
  },
  { timestamps: true },
);

export default mongoose.model("Event", schema);
