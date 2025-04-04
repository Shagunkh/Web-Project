const express= require("express");
const router = express.Router({mergeParams: true});
const wrapAsyc = require("../utils/wrapAsyc.js");
const ExpressError= require("../utils/ExpressError.js");
const {validateReview,isLoggedIn,isReviewAuthor}= require("../middleware.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const reviewController = require("../controllers/reviews.js");





//Reviews
router.post("/",isLoggedIn,validateReview, wrapAsyc(reviewController.createReview));



//delete review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsyc(reviewController.destroyReview));

module.exports= router;


