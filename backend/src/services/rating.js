const Review = require("../models/review.model");
const FoodPartner = require("../models/food-partner.model");

async function recalculateAvgRating(partnerId) {
  // Why aggregate in MongoDB instead of averaging in JS: this runs inside
  // the DB itself — far faster than pulling every review document over
  // the network just to average one field.
  const result = await Review.aggregate([
    { $match: { foodPartner: partnerId } },
    { $group: { _id: "$foodPartner", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const { avgRating = 0, count = 0 } = result[0] || {};
  // Why store this on FoodPartner instead of computing it live on every
  // page load: search-sort-by-rating and the storefront both need this
  // constantly — recomputing an aggregation on every view doesn't scale.
  await FoodPartner.findByIdAndUpdate(partnerId, { avgRating, reviewCount: count });
}

module.exports = { recalculateAvgRating };