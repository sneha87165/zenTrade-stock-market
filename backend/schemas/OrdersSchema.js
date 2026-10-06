const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  action: { type: String, required: true }, // BUY or SELL
  date: { type: Date, default: Date.now },
});

module.exports = { OrdersSchema };

