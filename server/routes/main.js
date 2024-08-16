const express = require('express');
const router = express.Router();
const Post = require('../models/posts');


router.get('', async (req, res) => {  
    try {

        const locals = {
            title: 'Blog Post',
            description: "A blog website created using Node.js, Express, and MongoDB."
        }


        //Pagination
        let perPage = 10; // Number of posts per page
        let page = req.query.page || 1; // Query string for page number, if not provided, default to 1



        const data = await Post.aggregate([{$sort : {createdAt : -1}}]) // Sort by date in descending order
        .skip(perPage * page - perPage) // Skip the first n posts
        .limit(perPage) // Limit the number of posts to be displayed
        .exec(); // Execute the query


        //Counting total number of posts
        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);



        res.render('index', { 
            locals,
             data,
             current : page, // Current page number
             nextPage : hasNextPage ? nextPage : null // Next page number
             });
    } 
    catch(err) {
        console.log(err);
    }
});

module.exports = router;