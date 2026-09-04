const { z } = require("zod");

const placeOrderSchema = z.object({
  addressId: z.string().min(1),
  paymentMethod: z.enum(["cod", "online"]),
});

const reviewSchema = z.object({
  orderId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

module.exports = { placeOrderSchema, reviewSchema };