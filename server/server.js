const express = require('express');
const carDao = require('./car_dao.js');
const userDao = require('./user_dao.js');
const rentalDao = require('./rental_dao.js');
const morgan = require('morgan'); // logging middleware
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const jwtSecret = '1234567890';
const expireTime = 300; //seconds
const authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };

const app = express();
const port = 3001;

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());

// Authentication endpoint
app.post('/api/login', (req, res) => {
    const nickname = req.body.nickname;
    const password = req.body.password;

    userDao.getUser(nickname)
        .then((user) => {

            if (user === undefined) {
                res.status(404).send({
                    errors: [{ 'param': 'Server', 'msg': 'Invalid nickname' }]
                });
            } else {
                if (!userDao.checkPassword(user, password)) {
                    res.status(401).send({
                        errors: [{ 'param': 'Server', 'msg': 'Wrong password' }]
                    });
                } else {
                    //AUTHENTICATION SUCCESS
                    const token = jsonwebtoken.sign({ userid: user.id }, jwtSecret, { expiresIn: expireTime });
                    res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });
                    res.json({ id: user.id, nickname: user.nickname, name: user.name, lastname: user.lastname });
                }
            }
        }).catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

app.use(cookieParser());

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').end();
});

app.get('/api/cars', (req, res) => {
    carDao.getCars()
        .then((cars) => {
            res.json(cars);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

// For the rest of the code, all APIs require authentication
app.use(
    jwt({
        secret: jwtSecret,
        getToken: req => req.cookies.token
    })
);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json(authErrorObj);
    }
});

app.get('/api/user', (req, res) => {
    const id = req.user && req.user.userid;
    userDao.getUserById(id)
        .then((user) => {
            res.json({ id: user.id, nickname: user.nickname, name: user.name, lastname: user.lastname });
        }).catch(
            (err) => {
                res.status(500).json({
                    errors: [{ 'msg': err }],
                });
            }
        );
});

app.get('/api/rentals', (req, res) => {
    const user_id = req.user && req.user.userid;
    rentalDao.getRentals(user_id)
        .then((rentals) => {
            res.json(rentals);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

app.get('/api/cars/available', (req, res) => {
    carDao.getAvailableCars(req.query.startDate, req.query.endDate, req.query.category)
        .then((cars) => {
            res.json(cars);
        })
        .catch((err) => {
            res.status(400).json({
                errors: [{ 'msg': err }],
            });
        });
});

app.post('/api/payment', (req, res) => {
    const name = req.body.name;
    const number = req.body.number;
    const CVV = req.body.CVV;
    const price = req.body.price;
    rentalDao.makePayment(name, number, CVV, price)
        .then((status) => {
            res.json(status);
        })
        .catch((err) => {
            res.status(400).json({
                errors: [{ 'msg': err }],
            });
        });
});

app.post('/api/rentals', (req, res) => {
    const rental = req.body;
    rentalDao.addRental(rental)
        .then((id) => res.status(201).json({ "id": id }))
        .catch((err) => {
            res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }], })
        });
});

app.delete('/api/rentals/:rentalId', (req, res) => {
    rentalDao.deleteRental(req.params.rentalId)
        .then((result) => res.status(204).end())
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});

app.listen(port, () => console.log('Server ready'));