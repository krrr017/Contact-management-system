const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');


require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


const handlebars = exphbs.create({ extname: '.hbs', });
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'))


const oneDay = 24 * 60 * 60 * 1000;
app.use(
    session({
        secret: process.env.SECRET_KEY,
        saveUninitialized: true,
        resave: false,
        cookie: { maxAge: oneDay }
    })
);

app.use(flash());


const routes = require('./server/routes/route');
app.use('/', routes);

app.listen(port, () => console.log(`Listening on port ${port}`));