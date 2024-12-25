const bcrypt = require('bcryptjs');

const User = require("../models/User");

exports.login = (req, res) => {
    res.render("login", {
        pageTitle: "ورود به بخش مدیریت",
        path: "/login",
        message: req.flash("success_msg")
    });
};

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
        // const hash = await bcrypt.hash(password, 100);
        // await User.create({ fullname, email, password: hash });
        // res.redirect("/users/login");
        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) throw err;

                await User.create({
                    fullname,
                    email,
                    password: hash,
                });

                req.flash("success_msg", "ثبت نام با موفقیت انجام شد");

                res.redirect("/users/login");
            })
        })

        // const user = new User({
        //     fullname,
        //     email,
        //     password,
        // });
        // user.save()
        //     .then((user) => {
        //         console.log(user);
        //         res.redirect("/users/login");
        //     })
        //     .catch((err) => {
        //         if (err) throw err;
        //     });
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
