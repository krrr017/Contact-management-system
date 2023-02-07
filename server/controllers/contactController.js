const mysql = require('mysql2');

// Connection Pool
let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect((error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MySQL connected!")
    }
});





// View contacts
exports.view = (req, res, next) => {
  if(req.session.loggedin){
    connection.query('SELECT * FROM contact WHERE status = "active"', (err, rows) => {
        if (!err) {
            let removedUser = req.query.removed;
            res.render('home', { rows, removedUser });
        } else {
            console.log(err);
        }
        console.log('The data from contact table: \n', rows);
    });
  }else{
    res.redirect('/login');
  }
};



exports.form = (req, res) => {
  res.render('add-user');
}



// Add new contact
exports.create = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  connection.query('INSERT INTO contact SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?', [first_name, last_name, email, phone, comments], (err, rows) => {
    if (!err) {
      res.render('add-user', { alert: 'User added successfully.' });
    } else {
      console.log(err);
    }
    console.log('The data from contact table: \n', rows);
  });
}



// Edit contact
exports.edit = (req, res) => {
  connection.query('SELECT * FROM contact WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      res.render('edit-user', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from contact table: \n', rows);
  });
}



// Update contact
exports.update = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  connection.query('UPDATE contact SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, req.params.id], (err, rows) => {
    if (!err) {
      connection.query('SELECT * FROM contact WHERE id = ?', [req.params.id], (err, rows) => {
        if (!err) {
          res.render('edit-user', { rows, alert: `${first_name} has been updated.` });
        } else {
          console.log(err);
        }
        console.log('The data from contact table: \n', rows);
      });
    } else {
      console.log(err);
    }
    console.log('The data from contact table: \n', rows);
  });
}

// Delete contact
exports.delete = (req, res) => {
  // Hide a record
  connection.query('UPDATE contact SET status = ? WHERE id = ?', ['removed', req.params.id], (err, rows) => {
    if (!err) {
      let removedUser = encodeURIComponent('Contact information successeflly removed.');
      res.redirect('/?removed=' + removedUser);
    } else {
      console.log(err);
    }
    console.log('The data from contact table are: \n', rows);
  });

}

// View contacts
exports.viewall = (req, res) => {
  connection.query('SELECT * FROM contact WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      res.render('view-user', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from contact table: \n', rows);
  });

}