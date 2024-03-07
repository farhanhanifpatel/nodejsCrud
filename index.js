const express = require('express')
const con = require('./connection')
const jwt = require('jsonwebtoken')
const secretKey = 'secretKey'
// const { INT24 } = require('mysql/lib/protocol/constants/types')

const app = express()
app.use(express.json())

app.post('/login_user', (req, res) => {
    const { email, password } = req.body

    if (!email) {
        res.json({ message: 'Please enter email', code: 0 })
    }

    if (!password) {
        res.json({ message: 'Please enter password', code: 0 })
    }
    con.query(
        'select email,password from  tbl_user where email = ? and password = ?',
        [email, password],
        (err, result) => {
            if (err) {
                console.log(err)
            } else {
                console.log('-----||', result[0], result[1])
                if (result[0] || result[1]) {
                    jwt.sign({ result }, 'secretKey', { expiresIn: '300s' }, (err, token) => {
                        res.json({ message: 'login successfully', token: token, code: 1 })
                    })
                } else {
                    res.json({ message: 'invalid user', code: 0 })
                }
            }
        }
    )
})

app.post('/add_user', (req, res) => {
    const { name, email, address } = req.body

    if (!name) {
        res.json({ message: 'Please enter name', code: 0 })
    }

    if (!email) {
        res.json({ message: 'Please enter email', code: 0 })
    }

    if (!address) {
        res.json({ message: 'Please enter address', code: 0 })
    }
    con.query(
        'INSERT INTO tbl_user(name, email, address) VALUES (?, ?, ?)',
        [name, email, address],
        (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.json({ message: 'User added successfully', code: 1 })
            }
        }
    )
})

app.get('/get_data', (req, res) => {
    con.query('select * from tbl_user', function (err, result) {
        if (err) {
            console.log('An error occurred')
        } else {
            res.send(result)
        }
    })
})

app.put('/update_user/:id', (req, res) => {
    const { name, email, address } = req.body
    const id = req.params.id
    con.query(
        'UPDATE tbl_user SET name = ?, email = ?, address = ? where id = ?',
        [name, email, address, id],
        (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.json({ message: 'User Updated Successfully', code: 1 })
            }
        }
    )
})

app.delete('/delete_user/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    con.query('select * from  tbl_user where id = ?', [id], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log(result)
            console.log('------------------------>')

            if (!result[0]) {
                res.json({ message: 'User not found', code: 0 })
            } else {
                con.query('delete from tbl_user where id = ?', [id], (err, result) => {
                    if (err) {
                        console.log('error')
                    } else {
                        res.json({ message: 'User deleted Successfully', code: 1 })
                    }
                })
            }
        }
    })
})

app.listen(8000)
