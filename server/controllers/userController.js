const mysql = require('mysql2');

// Connection Pool
let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
    database: process.env.DB_LOGIN_NAME
});

connection.connect((error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MySQL2 connected!")
    }
})



//Register Form
exports.register =(req, res) => {
    res.render('register');
}



//Register Account
exports.createAccount = (req, res) => {
    const { account_name, password, password_confirm } = req.body;

//  if(password !== password_confirm){
//    return res.render('register', {message: 'Passwords do not match'})
//  }

    connection.query('INSERT INTO users SET account_name = ?, password = ?', [account_name, password], (err, rows) => {
        if (!err) {
            res.render('login', { alert: 'Registered successfully.' });
        } else {
            console.log(err);
        }
        console.log('The data from users table: \n', rows);
    });
}



//Login Form
exports.login = (req, res, next) => {
    res.render('login');
}



//Login
exports.auth = (req, res, next) => {
	
	const { account_name, password } = req.body;
	
    connection.query('SELECT * FROM users WHERE account_name = ? AND password = ?', [account_name, password], (err, rows, fields) =>{
        if(err) throw err;

        //user nor found
        if(rows.length <= 0) {
            console.log(rows);
            res.render('login', { alert: 'Wrong Account Name or/and Password' });
        } else {
        //userfound
            req.session.loggedin = true;
            req.session.account_name = account_name;
            res.redirect('/');
        }
    });
	}




//Logout
exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
}