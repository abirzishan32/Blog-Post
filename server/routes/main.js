const express = require('express');
const router = express.Router();
const Post = require('../models/posts');


router.get('', (req, res) => {
    res.render('index');
    }
);



function insertPostData() {
    Post.insertMany([
        {
            title: "Building APIs with Node.js",
            content: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js"
        }
    ])
    .then(() => {
        console.log("Data inserted successfully");
    })
    .catch(err => {
        console.error("Error inserting data:", err);
    });
}


insertPostData();



module.exports = router;