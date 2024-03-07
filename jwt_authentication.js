const express = require('express')
const con = require('./connection')
const jwt = require('jsonwebtoken')
const secretKey = 'secretKey'
// const { INT24 } = require('mysql/lib/protocol/constants/types')
// const { required } = require('nodemon/lib/config')

const app = express()
app.use(express.json())

app.post('/loginUser', (req, res) => {
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

function verifyToken(req, resp, next) {
    const bearerHeader = req.headers['authorization']
    // const bearerHeader = req.headers.authorization
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        const token = bearer[1]
        req.token = token
        console.log('-------Token----->', token)
        next()
    } else {
        console.log('-------Token----->')
        resp.send({
            result: 'token is invalid',
        })
    }
}

app.get('/get_data', verifyToken, (req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) {
            res.json({ message: 'token is invalid', code: 0 })
        } else {
            con.query('select * from tbl_user', function (err, result) {
                if (err) {
                    console.log('An error occurred')
                } else {
                    res.json({ data: result, authData, code: 1 })
                }
            })
        }
    })
})

app.delete('/delete_user/:id', verifyToken, (req, res) => {
    const id = req.params.id
    console.log(id)
    jwt.verify(req.token, secretKey, (err, authData) => {
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
                            res.json({ message: 'User deleted Successfully', authData, code: 1 })
                        }
                    })
                }
            }
        })
    })
})

app.put('/update_user/:id', verifyToken, (req, res) => {
    const { name, email, address } = req.body
    const id = req.params.id
    jwt.verify(req.token, secretKey, (err, authData) => {
        con.query('select * from  tbl_user where id = ?', [id], (err, result) => {
            if (err) {
                console.log(err)
            } else {
                console.log(result)
                console.log('------------------------>')

                if (!result[0]) {
                    res.json({ message: 'User not found', code: 0 })
                } else {
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
                }
            }
        })
    })
})
app.listen(8000)
