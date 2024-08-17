require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const methodOverride = require('method-override');


const app = express();
const PORT = process.env.PORT || 3000;


//Connecting to Database
connectDB();

app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
app.use(express.json()); //Used to parse JSON bodies
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'meow meow',
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({ 
        mongoUrl: process.env.MONGODB_URI 
    })
}));


app.use(express.static('public'));

//Template Layout
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


app.use('/', require('./server/routes/main')); //Main routes 
app.use('/', require('./server/routes/admin')); //Admin routes





app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
