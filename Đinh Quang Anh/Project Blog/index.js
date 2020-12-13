const express = require("express");
const fileUpload = require('express-fileupload');
const app = new express();
const path = require("path");
const ejs = require("ejs");
app.set("view engine", "ejs");

// default options
app.use(fileUpload());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.raw());

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/my_database", { useNewUrlParser: true });

const BlogPost = require("./models/BlogPost.js");

//Đăng ký thư mục public.....
app.use(express.static("public"));

//Tao server
app.listen(4000, () => {
  console.log("OK. App listening on port 4000");
});

app.get("/", (request, response) => {
  BlogPost.find({}, function (error, posts) {
    console.log(posts);
    response.render("index", {
      blogposts: posts,
    });
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/post/:id", (req, res) => {
  BlogPost.findById(req.params.id, function (error, detailPost) {
    res.render("post", {
      detailPost,
    });
  });
});
app.get("/post/:id/delete", (req, res) => {
  BlogPost.findByIdAndDelete(req.params.id, (error, blogspot) => {
    res.redirect("/");
  });
});

app.get("/posts/new", (req, res) => {
  res.render("create");
});

app.post("/posts/store", function (req, res) {
  let image = req.files.image;
  console.log(image);
  image.mv(
    path.resolve(__dirname, "public/upload", image.name),
    function (error) {
      BlogPost.create(
        {
          ...req.body,
          image: "/upload/" + image.name,
        },
        (err) => {
          res.redirect("/");
        }
      );
    }
  );
});
