const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');

router.post('/sign-up',userMiddleware.validateRegister, (req, res) => {
    db.query(
        `SELECT * FROM users WHERE LOWER(username) = LOWER (${db.escape(req.body.username)});`,
        (err, result) => {
            if (result.length) {
                return res.status(409).send({
                    msg : 'This username is already in use!'
                });
            }else {
                // username is available
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).send({
                            msg : err
                        });
                    } else {
                     // has hashed pw => add to database
                     db.query(
                        `INSERT INTO users VALUES('${uuid.v4()}', ${db.escape(req.body.username)}, ${db.escape(hash)}, now(),now())`,
                        (err, result) => {
                            if (err) {
                                throw err;
                                return res.status(400).send({
                                    msg:err
                                });
                            }
                            return res.status(201).send({
                                msg : 'Registered!'
                            });
                        }
                     );
                    }
                });
            }
        }
    );
});

router.get('/tes', (req, res) => {
    res.send("Ini Halaman Tes");
});

router.post('/login', (req,res,next) => {
    db.query(
        `SELECT * FROM users WHERE username = ${db.escape(req.body.username)};`,
        (err,result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg:err
                });
            }
            if (!result.length) {
                return res.status(401).send({
                    msg:'Username or password is incorrect!'
                });
            }

            bcrypt.compare(
                req.body.password,
                result[0]['password'],
                (bErr,bResult) => {
                    if (bErr) {
                        throw bErr;
                        return res.status(401).send({
                            msg:'Username or password is incorrect!'
                        });
                    }
                    if (bResult) {
                        const token = jwt.sign({
                            username : result[0].username,
                            userId: result[0].id
                            },
                            'SECRETKEY', 
                            // {
                            //     expiresIn : '7d'
                            // }
                        );

                        db.query(
                            `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
                        );
                        return res.status(200).send({
                            msg : 'Logged In!',
                            token, user : result[0]
                        });
                    }
                    return res.status(401).send({
                        msg: 'Username or password is incorrect!'
                    });
                }
            );
        }
    );
});

router.get('/secret-route', userMiddleware.isLoggedIn, (req,res,next) => {
    console.log(req.userData);
    res.send('This is the secret content. Only logged in users can see that!');
});


module.exports = router;