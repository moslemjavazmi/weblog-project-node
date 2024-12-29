const { Router } = require("express");

const blogConteroller = require("../controllers/blogController");

const router = new Router();

//  @desc   Weblog Index Page
//  @route  GET /
router.get("/", blogConteroller.getIndex);

//  @desc   Weblog post Page
//  @route  GET / post/:id
router.get("/post/:id", blogConteroller.getSinglePost);

module.exports = router;
