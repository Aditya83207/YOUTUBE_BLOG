const router = require("express").Router();
const { signup, signin, me } = require("../controllers/authController");
const { protect } = require("../middlewares/auth");

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", protect, me);

module.exports = router;
