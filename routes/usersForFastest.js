const { Router } = require("express");
const Validator = require("fastest-validator");
const { type } = require("os");
const { normalize } = require("path");


const router = new Router();
const v = new Validator();

const schema = {
    fullname: {
        type: "string",
        trim: true,
        max: 255,
        min: 5,
        messages: {
            required:"نام و نام خانوادگی الزامی است",
            stringMax: "نام و نام خانوادگی نباید بیشتر از 255 کاراکتر باشد",
            stringMin: "نام و نام خانوادگی نباید از 4 کاراکتر کمتر باشد"
            
        },
    },
    email: {
        type: "email",
        normalize: true,
        messages: {
            emailEmpty: "ایمیل را وارد کنید",
            required: "ایمیل الزامی می باشد",
            string: "آدرس ایمیل را بررسی کنید",
        },
    },
    password: {
        type: "string",
        min: 4,
        max: 255,
        messages: {
            required: "کلمه عبور الزامی است",
            string: "کلمه عبور را بررسی کنید",
            stringMax: "کلمه عبور نمی تواند از 255 کاراکتر بیشتر باشد",
            stringMin: "کلمه عبور نباید از 4 کاراکتر کمتر باشد"
        },
    },
    confirmPassword: {
         type: "string",
        min: 4,
        max: 255,
        messages: {
            required: " تاییدیه کلمه عبور الزامی است",
            string: "تاییدیه کلمه عبور را بررسی کنید ",
            stringMax: "تاییدیه کلمه عبور نمی تواند از 255 کاراکتر بیشتر باشد",
            stringMin: "تاییدیه کلمه عبور نباید از 4 کاراکتر کمتر باشد"
        },
    },
}


//  @desc   Login Page
//  @route  GET /users/login
router.get("/login", (req, res) => {
    res.render("login", { pageTitle: "ورود به بخش مدیریت", path: "/login" });
});

//  @desc   Register Page
//  @route  GET /users/register
router.get("/register", (req, res) => {
    res.render("register", {
        pageTitle: "ثبت نام کاربر جدید",
        path: "/register",
    });
});

//  @desc   Register Handle
//  @route  POST /users/register
router.post("/register", (req, res) => {
    const validate = v.validate(req.body, schema);
    const errorArr = [];
    if (validate === true) {
        const { fullname, email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            errorArr.push({ message: "کلمه عبور یکسان نیست" });
            return res.render("register", {
                pageTitle: "ثبت نام کاربر",
                path: "/register",
                errors: errorArr
            })
        }
        res.redirect("/users/login");
    } else {
        console.log(validate)
        res.render("register", {
                pageTitle: "ثبت نام کاربر",
                path: "/register",
                errors: validate,
        })
    }
});

module.exports = router;
