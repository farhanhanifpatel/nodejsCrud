var mysql = require('mysql')

const con = mysql.createConnection({
    user: 'root',
    password: '3#a0y8FQgt',
    port: '3306',
    database: 'my_db',
})

con.connect(function (err) {
    if (err) {
        console.log('error')
    } else {
        console.log('Connection Successfully')
    }
})
module.exports = con
