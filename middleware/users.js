const jwt = require('jsonwebtoken');
module.exports = {
    validateRegister : (req, res, next) => {
        //username min length 3
        if (!req.body.username || req.body.username.length < 3) {
            return res.status(400).send({

                msg : 'Please enter a username with min. 3 chars'+req.username.length
            });
        }

        //password min 6
        if (!req.body.password || req.body.password.length < 6) {
            return res.status(400).send({
                msg : 'Please enter a password with min. 6 chars'
            });
        }

        if (!req.body.password_repeat || req.body.password != req.body.password_repeat) {
            return res.status(400).send({
                msg : 'Both passwords must match'
            });
        }

        next();
    },
    isLoggedIn : (req, res, next) =>{
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(
                token,
                'SECRETKEY'
            );
            req.userData = decoded;
            next();
        } catch (err) {
            // console.log(token);
            return res.status(401).send({
                msg : 'Your session is not valid!'
            });
        }
    }
}