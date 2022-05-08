const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema =  Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 0,
      },
      title: {
        type: String,
      },
      price: {
        type: Number,
        default: 0,
      },
    },
  ],
  totalCost: {
    type: Number,
    default: 0,
    required: true,
  },
  totalQty: {
    type: Number,
    default: 0,
    required: true,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Cart", cartSchema);
