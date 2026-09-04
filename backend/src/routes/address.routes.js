const router = require("express").Router();
const addressController = require("../controllers/address.controller");
const { authUserMiddleware } = require("../middleware/auth.middleware");

router.get("/", authUserMiddleware, addressController.getAddresses);
router.post("/", authUserMiddleware, addressController.addAddress);
router.delete("/:id", authUserMiddleware, addressController.deleteAddress);

module.exports = router;
