

const { Schema } = require("mongoose");

const HoldingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: { type: String, required: true },
  qty: { type: Number, required: true, default: 0 },
  avg: { type: Number, required: true, default: 0 },
  price: { type: Number, default: 0 },
  net: { type: String, default: "0.00%" },
  day: { type: String, default: "0.00%" },
});

module.exports = { HoldingSchema };