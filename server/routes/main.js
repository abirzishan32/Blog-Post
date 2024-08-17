const express = require('express');  // Import the express module
const router = express.Router(); // Create a new router object
const Post = require('../models/posts');  // Import the Post model



/*
router.get('', async (req, res) => { ... }) is part of an Express.js application and is used to define
 a route handler for HTTP GET requests.
*/

router.get('', async (req, res) => {   /*
                                        async is a keyword used in JavaScript to define an asynchronous function.
                                        When a function is marked as async, it can use the await keyword inside its body.
                                         This allows the function to pause execution at an await expression until a Promise is resolved,
                                          and then resume execution with the resolved value.
                                        */
    try {

        const locals = {
            title: 'Blog Post',
            description: "A blog website created using Node.js, Express, and MongoDB."
        }


        //Pagination
        let perPage = 5; // Number of posts per page
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



  router.post('/search', async (req, res) => {  /* A route that handles POST requests to the /search URL.
                                                    This route is typically triggered when a user submits a search form on your website. */
    try {
      const locals = {
        title: "Seach",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }
  
      let searchTerm = req.body.searchTerm; /* This line retrieves the user's search query from the form submission. req.body.searchTerm captures
                                                 the value of the searchTerm input field from the form. */

      const searchNoSpecialChar = searchTerm
      .replace(/[^a-zA-Z0-9 ]/g, "")  /* removes any special characters from the search term. It uses a regular expression to replace any characters that are 
                                                                            not letters, numbers, or spaces with an empty string. */
  
      const data = await Post.find({
        $or: [
          { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
          { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
        ]
      });
  
      res.render("search", {
        data,
        locals,
        currentRoute: '/'
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });




module.exports = router; // Export the router object to make it available to other parts of the application.