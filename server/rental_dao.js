'use strict';

const Rental = require('./rental.js');
const db = require('./db.js');

const createRental = function (row) {
    return new Rental(row.id, row.startDate, row.endDate, row.user_id, row.car_id, row.car_model, row.car_category, row.driverAge, row.extraDrivers, row.km_day, row.insurance, row.price);
}

//Get rentals for logged in user
exports.getRentals = function (user_id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT R.id, R.startDate, R.endDate, R.user as user_id, R.car as car_id, C.model as car_model, C.category as car_category, R.driverAge, R.extraDrivers, R.km_day, R.insurance, R.price FROM rentals as R INNER JOIN cars as C ON R.car = C.id WHERE R.user = ? ORDER BY R.startDate";
        db.all(sql, [user_id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let rentals = rows.map((row) => createRental(row));
                resolve(rentals);
            }
        });
    });
}

exports.addRental = function (rental) {
    return new Promise((resolve, reject) => {
        const sql = "insert into rentals (startDate, endDate, user, car, driverAge, extraDrivers, km_day, insurance, price) VALUES (?,?,?,?,?,?,?,?,?)";
        db.run(sql, [rental.startDate, rental.endDate, rental.user_id, rental.car_id, rental.driverAge, rental.extraDrivers, rental.km_day, rental.insurance, rental.price], function (err) {
            if(err) {
                reject(err);
            }
            else {
                resolve(this.lastID);
            }
        });
    })
}

exports.deleteRental = function(id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM rentals WHERE id = ?';
        db.run(sql, [id], (err) => {
            if(err)
                reject(err);
            else 
                resolve(null);
        })
    });
}

// Function that only checks whether all required fields for payment are present or not
exports.makePayment = function (name, number, CVV, price) {
    return new Promise((resolve, reject) => {
        if (name && number && CVV && price)
            resolve ({msg: "success"});
        else
            reject("failed");
    })
}