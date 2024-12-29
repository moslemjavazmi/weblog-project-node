const bcrypt = require("bcryptjs");
const passport = require('passport');
// import fetch from 'node-fetch';
const fetch = require('node-fetch');

const User = require("../models/User");

const { sendEmail } = require("../utils/mailer");

exports.login = (req, res) => {
    res.render("login", {
        pageTitle: "ورود به بخش مدیریت",
        path: "/login",
        message: req.flash("success_msg"),
        error: req.flash("error"),
    });
};
exports.handleLogin = async (req, res, next) => {
    if(!req.body["g-recaptcha-response"]){
        req.flash("error", "لطفا کپچا را تایید کنید");  
        return res.redirect("/users/login");
    }
    const secretKey = process.env.CAPTCHA_SECRET;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body["g-recaptcha-response"]}&remoteip=${req.connection.remoteAddress}`;
    
    const response = await fetch(verifyUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded:charset=UTF-8",
        },        
    });
    
    const json = await response.json();
    if(json.success){
        passport.authenticate("local", {
            failureRedirect: "/users/login",
            failureFlash: true,
        })(req, res, next);
    }else{
        req.flash("error", "لطفا کپچا را تایید کنید");  
        res.redirect("/users/login");
    }
    
    
}

exports.rememberMe = (req, res) => {
    if(req.body.remember){
        req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000 // 1 day save 
    }else{
        req.session.cookie.expire = null;
    }
    res.redirect("/dashboard");
}
exports.logout = (req, res) => {
    req.session = null;
    req.logout(function(err) {
        if (err) { return next(err); }
        // req.flash("success_msg", "شما با موفقیت از حساب کاربری خود خارج شدید");
        res.redirect("/users/login")
      });
}

exports.register = (req, res) => {
    res.render("register", {
        pageTitle: "ثبت نام کاربر جدید",
        path: "/register",
    });
};

exports.createUser = async (req, res) => {
    const errors = [];
    try {
        await User.userValidation(req.body);
        const { fullname, email, password } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            errors.push({ message: "کاربری با این ایمیل موجود است" });
            return res.render("register", {
                pageTitle: "ثبت نام کاربر",
                path: "/register",
                errors,
            });
        }

        // const hash = await bcrypt.hash(password, 10);
        // await User.create({ fullname, email, password: hash });
        await User.create({ fullname, email, password});

        //? send welcome email 
        sendEmail(
            email, 
            fullname,
            "به دایان وب خوش آمدید",
            "ثبت نام با موفقیت انجام شد",
            );

        req.flash("success_msg", "ثبت نام موفقیت آمیز بود.");
        res.redirect("/users/login");
    } catch (err) {
        console.log(err);
        err.inner.forEach((e) => {
            errors.push({
                name: e.path,
                message: e.message,
            });
        });

        return res.render("register", {
            pageTitle: "ثبت نام کاربر",
            path: "/register",
            errors,
        });
    }
};
