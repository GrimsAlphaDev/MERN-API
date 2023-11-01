const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const BlogPost = require("../models/blog");

exports.createBlogPost = (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        const err = new Error("Input Value Tidak Sesuai");
        err.errorStatus = 400;
        err.data = error.array().map((item) => item.msg);
        throw err;
    }

    if (!req.file) {
        const err = new Error("Image Harus Di Upload");
        err.errorStatus = 422;
        throw err;
    }

    const title = req.body.title;
    const image = req.file.path;
    const body = req.body.body;

    const Post = new BlogPost({
        title: title,
        body: body,
        image: image,
        author: {
            uid: 1,
            name: "Admin Tester",
        },
    });

    Post.save()
        .then((result) => {
            res.status(201).json({
                message: "Create Blog Post Success",
                data: result,
            });
        })
        .catch((err) => {
            console.log("err : ", err);
        });
};

exports.getAllBlogPost = (req, res, next) => {
    
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 5;
    let totalItems;

    BlogPost.find()
    .countDocuments()
    .then()
    .catch(err => {
        next(err);
    })
    
    BlogPost.find()
        .then((result) => {
            res.status(200).json({
                message: "Data Blog Post Berhasil Dipanggil",
                data: result,
            });
        })
        .catch((err) => {
            next(err);
        });
};

exports.getBlogPostById = (req, res, next) => {
    const postId = req.params.postId;
    BlogPost.findById(postId)
        .then((result) => {
            if (!result) {
                const error = new Error("Blog Post Tidak Ditemukan");
                error.errorStatus = 404;
                throw error;
            }
            res.status(200).json({
                message: "Data Blog Post Berhasil Dipanggil",
                data: result,
            });
        })
        .catch((err) => {
            next(err);
        });
};

exports.updateBlogPost = (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        const err = new Error("Input Value Tidak Sesuai");
        err.errorStatus = 400;
        err.data = error.array().map((item) => item.msg);
        throw err;
    }

    if (!req.file) {
        const err = new Error("Image Harus Di Upload");
        err.errorStatus = 422;
        throw err;
    }

    const title = req.body.title;
    const image = req.file.path;
    const body = req.body.body;
    const postId = req.params.postId;



    BlogPost.findById(postId)
        .then((post) => {
            if (!post) {
                const err = new Error("Blog Post Tidak Ditemukan");
                err.errorStatus = 404;
                throw err;
            }

            removeImage(post.image);

            post.title = title;
            post.body = body;
            post.image = image;

            // remove old image
            return post.save();
        })
        .then((result) => {
            res.status(200).json({
                message: "Update Success",
                data: result,
            });
        })
        .catch((err) => {
            next(err);
        });
};

exports.deleteBlogPost = (req, res, next) => {
    const postId = req.params.postId;

    BlogPost.findById(postId)
        .then((post) => {
            if (!post) {
                const err = new Error("Blog Post Tidak Ditemukan");
                err.errorStatus = 404;
                throw err;
            }

            removeImage(post.image);
            return BlogPost.findByIdAndDelete(postId);
        })
        .then(result => {
            res.status(200).json({
                message: "Hapus Blog Post Berhasil",
                data: result
            })
        })
        .catch((err) => {
            next(err);
        });
};

const removeImage = (filePath) => {
    console.log("filePath : ", filePath);
    console.log("dirname: ", __dirname);

    filePath = path.join(__dirname, "../..", filePath);
    fs.unlink(filePath, (err) => console.log(err));
};
