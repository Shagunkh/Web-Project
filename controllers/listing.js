const Listing = require("../models/listing");


module.exports.index = async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listing/index.ejs",{ allListings });
};
// module.exports.homepage= async (req,res)=>{
//     res.render("listing/home.ejs");
// }

module.exports.renderHome = async(req,res)=>{
    const listings = await Listing.find({}).limit(6); // Fetch recent 6 listings
    res.render("listing/home.ejs", { listings });
};
module.exports.renderNewForm =(req,res)=>{

    res.render("listing/new.ejs");
};

module.exports.showListing= async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate: { path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error","listing you requested for does not exist!");
        res.redirect("/listings");
    }
    const suggestedListings = await Listing.find({ _id: { $ne: id } }).limit(3);
    res.render("listing/show.ejs",{listing,suggestedListings});
};

module.exports.createListing=async(req,res,next)=>{
    // let {title,description,image,price,country,location}= req.body;
        let url = req.file.path;
        let filename = req.file.filename;
        const newListing =new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image={url,filename};
       
        await newListing.save();
        req.flash("success", "New Listing Created");
        res.redirect("/listings");

};

module.exports.renderEditForm=async (req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    if(!listing){
       req.flash("error","listing you requested for does not exist!");
       res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_150");

    res.render("listing/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing=async (req,res)=>{
    
    let {id}= req.params;
    
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    
    req.flash("success","Listings Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req,res)=>{
    let {id}= req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "New Listing Deleted");
    res.redirect("/listings");
};