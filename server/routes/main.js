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
        .skip(perPage * page - perPage)     /*  This calculation determines how many posts to skip, based on the current page.
                                            For example, if you're on page 2, it will skip the first 10 posts (10 * 2 - 10 = 10),
                                            so you start from the 11th post. */
        .limit(perPage) // This limits the number of posts retrieved to the perPage value, ensuring only 10 posts are fetched for the current page.
        .exec(); // Execute the query


        //Counting total number of posts
        const count = await Post.countDocuments(); // Count the total number of posts
        const nextPage = parseInt(page) + 1; // Next page number
        const hasNextPage = nextPage <= Math.ceil(count / perPage); /*Math.ceil(count / perPage) calculates the total number of pages needed. 
                                                                    If nextPage is less than or equal to this total, it means there is another page available,
                                                                     and hasNextPage will be true.  */


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




/* setting up a route that handles requests for individual blog posts. */
router.get('/post/:id', async (req, res) => {  /* a route that handles GET requests to URLs that match the pattern /post/:id.
                                                :id is a route parameter (often called a "slug" in the context of blog posts) that
                                                 acts as a placeholder for the actual ID of a blog post. */
    try {
      let slug = req.params.id;    /* retrieves the value of the id parameter from the URL.
                                     This value is stored in the variable slug, which represents the unique identifier
                                      for the blog post you want to retrieve. */
  
      const data = await Post.findById({ _id: slug });  /* uses Mongoose to query the MongoDB database and retrieve the blog post
                                                         with the specific _id that matches the slug. */
  
      const locals = {
        title: data.title,
        description: "Simple Blog created with NodeJs, Express & MongoDb.",
      }
  
      res.render('post', { 
        locals,
        data,
        currentRoute: `/post/${slug}`  /* The current URL path (/post/${slug}), which might be used for 
                                    navigation or highlighting the active route in the UI. */
      });
    } catch (error) {
      console.log(error);
    }
  
  });




module.exports = router;