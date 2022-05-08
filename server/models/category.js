const mongoose = require("mongoose");
const schema = new mongoose.Schema();
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const categorySchema = new schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    slug: "title",
    unique: true,
  },
});
module.exports = mongoose.model("Category", categorySchema);
