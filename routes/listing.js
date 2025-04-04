const express= require("express");
const router = express.Router();
const wrapAsyc = require("../utils/wrapAsyc.js");
const ExpressError= require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn ,isLoggedInn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage}= require("../cloudConfig.js");
const upload = multer({storage});




router.route("/")
    .get(wrapAsyc(listingController.index))
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsyc(listingController.createListing));
    
    // .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsyc(listingController.createListing));

//index route

//new route 
router.get("/new",isLoggedIn,listingController.renderNewForm);
router.get("/home",listingController.renderHome);

router.get("/api/search", async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.json([]); 
    }

    try {
        const listings = await Listing.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { categories: { $regex: query, $options: "i" } }
            ]
        }).limit(10);

        res.json(listings); 
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



router.route("/:id")
.get(wrapAsyc(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsyc(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsyc(listingController.destroyListing));




router.get("/:id/edit",isLoggedInn,isOwner,wrapAsyc(listingController.renderEditForm));




module.exports = router;