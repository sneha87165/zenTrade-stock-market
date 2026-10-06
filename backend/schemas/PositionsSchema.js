const { Schema } = require("mongoose");

const PositionsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  product: { type: String, default: "CNC" },
  name: { type: String, required: true },
  qty: { type: Number, required: true, default: 0 },
  avg: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  net: { type: String, default: "0.00%" },
  day: { type: String, default: "0.00%" },
  isLoss: { type: Boolean, default: false },
});

module.exports = { PositionsSchema };

