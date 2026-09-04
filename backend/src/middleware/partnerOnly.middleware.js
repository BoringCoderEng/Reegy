module.exports = function partnerOnly(
    req,
    res,
    next
) {
    if (
        req.user.role !==
        "food-partner"
    ) {
        return res.status(403).json({
            message:
                "Food partner access only"
        });
    }

    next();
};