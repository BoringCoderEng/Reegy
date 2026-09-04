const Order =
    require("../models/order.model");

const Food =
    require("../models/food.model");

const FoodPartner =
    require("../models/food-partner.model");


exports.getMyOrders = async (
    req,
    res
) => {
    try {
        const orders =
            await Order.find({
                foodPartner:
                    req.user._id
            })
                .populate("user", "name email")
                .populate("address")
                .populate("items.food")
                .sort({
                    createdAt: -1
                });

        res.json(orders);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message:
                "Failed to fetch partner orders"
        });
    }
};


exports.getPartnerStorefront =
    async (req, res) => {
        try {
            const partner =
                await FoodPartner.findById(
                    req.params.id
                );

            if (!partner) {
                return res.status(404).json({
                    message:
                        "Partner not found"
                });
            }

            const menu =
                await Food.find({
                    partner: partner._id
                });

            res.json({
                partner,
                menu
            });

        } catch (error) {
            console.error(error);

            res.status(500).json({
                message:
                    "Failed to fetch storefront"
            });
        }
    };

    