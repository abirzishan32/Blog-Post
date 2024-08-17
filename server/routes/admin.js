const express = require('express');
const router = express.Router();
const Post = require('../models/posts');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;


/*
checks whether the user has a valid JSON Web Token (JWT) in their cookies and,
if so, verifies the token before allowing the request to proceed to
the next middleware or route handler.
*/

const authMiddleware = (req, res, next ) => {  // We will use the middleware to the pages that requires login
  const token = req.cookies.token;

  if(!token) { // if there is no token return 401 unauthorized
    return res.status(401).json( { message: 'Unauthorized'} ); 
  }

  try {
    const decoded = jwt.verify(token, jwtSecret); /*  If a token is present, the middleware attempts to verify
                                                   it using the jwt.verify function. This function takes the token
                                                    and the secret key (jwtSecret) as arguments. The secret key is used
                                                     to verify that the token was indeed issued by the server and has 
                                                     not been tampered with. 
                                                     */

    req.userId = decoded.userId;   /* If the token is successfully verified, the payload (i.e., the data encoded within the token) is decoded.
                                     This payload typically includes the user ID or other relevant user information. 
                                    The middleware attaches this user ID to the req object, making it accessible in subsequent middleware and
                                     route handlers.
                                    */
    next();   /*  After successfully verifying the token and attaching the user ID,
               the middleware calls next() to pass control to the next middleware function
                or route handler in the stack.
              */
  } catch(error) {
    res.status(401).json( { message: 'Unauthorized'} );
  }
}

/**
 * GET /
 * Admin - Login Page
*/
router.get('/admin', async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    res.render('admin/index', { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});


/**
 * POST /
 * Admin - Check Login
*/
router.post('/admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne( { username } );

    if(!user) {
      return res.status(401).json( { message: 'Invalid credentials' } );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
      return res.status(401).json( { message: 'Invalid credentials' } );
    }

    const token = jwt.sign({ userId: user._id}, jwtSecret );
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/dashboard');

  } 
  catch (error) {
    console.log(error);
  }
});



/**
 * GET /
 * Admin Dashboard
*/
router.get('/dashboard', authMiddleware, async (req, res) => { //We will add middleware to the route that requires login
  try {
    const locals = {
      title: 'Dashboard',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.'
    }

    const data = await Post.find(); /*
                                    'await' keyword is used when retrieving data from a database to ensure that
                                    the data is fully fetched before proceeding with the next steps in the function
                                      */
    res.render('admin/dashboard', {
      locals,
      data,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});



/**
 * GET /
 * Admin - Create New Post
*/
router.get('/add-post', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Add Post',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.'
    }

    const data = await Post.find();
    res.render('admin/add-post', {
      locals,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});







/**
 * Admin - Register
*/
// router.post('/register', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     try {
//       const user = await User.create({ username, password:hashedPassword });
//       res.status(201).json({ message: 'User Created', user });
//     } catch (error) {
//       if(error.code === 11000) {
//         res.status(409).json({ message: 'User already in use'});
//       }
//       res.status(500).json({ message: 'Internal server error'})
//     }

//   } catch (error) {
//     console.log(error);
//   }
// });


module.exports = router;