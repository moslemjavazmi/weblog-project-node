const { Router } = require("express");
const {authenticated} = require("../middlewares/auth");

const adminController = require('../controllers/adminController');

const router = new Router();

//  @desc   Dashboard
//  @route  GET /dashboard
router.get("/", authenticated, adminController.getDashboard);

//  @desc   dashbord Add post
//  @route  GET /dashboard/add-post
router.get("/add-post", authenticated, adminController.getAddPost);

//  @desc   dashbord handle post creation
//  @route  POST /dashboard/add-post
router.post("/add-post", authenticated, adminController.createPost);

//  @desc   Dashboard Handle Image Upload
//  @route  POST /dashboard/image-upload
router.post("/image-upload", authenticated, adminController.uploadImage);

module.exports = router;