var token = require('../utils/token');
var cookie = require('cookie');

exports.login = (req, res) => {

    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password)
        return res.status(400).send('Email or password missing');

    if (username === 'manager' && password === '123456') {
        var loggedInUser = {
            first_name: 'Product',
            last_name: 'Manager',
            username: 'manager',
            role: 'manager'
        };

        /** Token creation **/
        token.create((err, accessToken) => {
            if (err)
                return res.status(500).send(err);

            var ttl = 60 * 60 * 24 * 7; // => 1 Week
            token.setTokenWithData(accessToken, loggedInUser, ttl, (err) => {
                if (err)
                    return res.status(500).send(err);

                // set access token cookie
                res.setHeader('Set-Cookie', cookie.serialize('access_token', accessToken, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 7 // => 1 Week
                }));

                res.status(200).send(loggedInUser);
            });
        });
    } else {
        res.status(404).send('User not found');
    }
};

exports.logout = (req, res) => {
    var cookies = cookie.parse(req.headers.cookie || '');
    var accessToken = cookies.access_token;

    if (!accessToken) {
        return res.status(403).send("No token");
    }

    token.expire(accessToken, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        // expire cookie
        res.setHeader('Set-Cookie', cookie.serialize('access_token', '', {
            httpOnly: true,
            maxAge: -1
        }));

        res.status(200).send();
    });
};
