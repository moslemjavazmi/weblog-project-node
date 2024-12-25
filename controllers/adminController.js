const multer = require("multer");
const sharp = require("sharp");
const uuid = require("uuid").v4;

const Blog = require("../models/Blog");
const {formatDate} = require('../utils/jalali');
const { get500 } = require("./errorConteroller");
const { storage, fileFilter } = require("../utils/multer");

exports.getDashboard = async (req, res) => {
    try {
        const blogs = await Blog.find({user: req.user._id});

        res.render("private/blogs", {
            pageTitle: "بخش مدیریت | داشبورد",
            path: "/dashboard",
            layout: "./layouts/dashLayout",
            fullname: req.user.fullname,
            blogs,
            formatDate
        });
    } catch (err) {
        console.log(err)
        get500(req, res);
    }

};

exports.getAddPost = (req, res) => {
    res.render("private/addPost", {
        pageTitle: "بخش مدیریت | افزودن پست جدید",
        path: "/dashboard/add-post",
        layout: "./layouts/dashLayout",
        fullname: req.user.fullname,//null
    });
}
exports.createPost = async (req, res) => {
    const errorArr = [];

    try {
        await Blog.postValidation(req.body);
        await Blog.create({ ...req.body, user: req.user.id });
        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
        err.inner.forEach((e) => {
            errorArr.push({
                name: e.path,
                message: e.message,
            });
        });
        res.render("private/addPost", {
            pageTitle: "بخش مدیریت | ساخت پست جدید",
            path: "/dashboard/add-post",
            layout: "./layouts/dashLayout",
            fullname: req.user.fullname,
            errors: errorArr,
        });
    }
};

exports.uploadImage = (req, res) => {
    const upload = multer({
        limits: { fileSize: 4000000 },
        // dest: "uploads/",
        // storage: storage,
        fileFilter: fileFilter,
    }).single("image");
    //req.file
    // console.log(req.file)

    upload(req, res, async (err) => {
        if (err) {
            if(err.code === "LIMIT_FILE_SIZE"){
                return res
                .status(400)
                .send("حجم فایل باید کمتر از 4 مگابایت باشد")
            }
            res.send(err);
        } else {
            if (req.file) {
                console.log(req.file);
                const fileName = `${uuid()}_${req.file.originalname}`;
                await sharp(req.file.buffer)
                    .jpeg({
                        quality: 60,
                    })
                    .toFile(`./public/uploads/${fileName}`)
                    .catch((err) => console.log(err));
                res.status(200).send(`http://localhost:3000/uploads/${fileName}`);
            } else {
                res.send("جهت آپلود باید عکسی انتخاب کنید");
            }
        }
    });
};
