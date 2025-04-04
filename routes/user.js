const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc.js");
const User = require("../models/user.js"); 
const passport = require("passport");
const { saveRedirectedUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt"); 

// SIGNUP ROUTE
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

// LOGIN ROUTE
router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectedUrl, passport.authenticate("local", {
        failureRedirect: '/login',
        failureFlash: true
    }), userController.login);

// FORGOT PASSWORD FORM
router.get("/forgot-password", (req, res) => {
    res.render("users/forgot.ejs");
});

// FORGOT PASSWORD (POST)
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        req.flash("error", "No account with that email exists.");
        return res.redirect("/forgot-password");
    }

    
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1-hour expiration
    await user.save();

    try {
        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // Ensure correct email
                pass: process.env.EMAIL_PASS, // Use App Password or OAuth2
            },
        });

       
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: "Password Reset Request",
            text: `You requested a password reset. Click the link below:
            \nhttp://${req.headers.host}/reset-password/${resetToken}
            \nThis link is valid for 1 hour.`,
        };

        // 🔹 Send Email
        await transporter.sendMail(mailOptions);
        req.flash("success", "Check your email for the password reset link.");
        res.redirect("/login");
    } catch (error) {
        console.error("Error sending email:", error);
        req.flash("error", "Error sending email. Try again later.");
        res.redirect("/forgot-password");
    }
});

// RESET PASSWORD FORM
router.get("/reset-password/:token", async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }, 
    });

    if (!user) {
        req.flash("error", "Invalid or expired password reset link.");
        return res.redirect("/forgot-password");
    }

    res.render("users/reset.ejs", { token: req.params.token });
});

//RESET PASSWORD 
router.post("/reset-password/:token", async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect("/forgot-password");
    }

    if (req.body.password !== req.body.confirmPassword) {
        req.flash("error", "Passwords do not match.");
        return res.redirect("back");
    }

    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

   
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    req.flash("success", "Password successfully updated. You can now log in.");
    res.redirect("/login");
});




//notify email
// Notify email route
router.post("/send-email", async (req, res) => {
    const { email } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587, // Use 587 instead of 465
            secure: false, // Use `false` for TLS
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            to: email,
            from: process.env.EMAIL_USER,
            subject: "Thank You for Subscribing!",
            text: "Thank you for connecting with us! You'll receive our latest offers soon.",
        };

        // 🔹 Send Email
        await transporter.sendMail(mailOptions);
        req.flash("success", "Thank you for subscribing! Check your email.");
        res.redirect("back"); // 🔹 Redirects user back to the page

    } catch (error) {
        console.error("Error sending email:", error);
        req.flash("error", "Error sending email. Try again later.");
        res.redirect("back"); // 🔹 Redirects back even in case of an error
    }
});



// LOGOUT ROUTE
router.get("/logout", userController.logout);

module.exports = router;





// FORGOT PASSWORD (POST)
