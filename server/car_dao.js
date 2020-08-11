'use strict';

const Car = require('./car.js');
const db = require('./db.js');

const createCar = function (row) {
    return new Car(row.id, row.model, row.brand, row.category);
}

exports.getCars = function() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT  * FROM cars ORDER BY category, brand, model";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let cars = rows.map((row) => createCar(row));
                resolve(cars);
            }
        });
    });
}

// Function that gets all available cars for a given period and category
exports.getAvailableCars = function(startDate, endDate, category) {
    return new Promise((resolve, reject) => {
        if(!startDate || !endDate || !category)
            reject('Parameters missing');
        if (new Date(startDate).getTime() > new Date(endDate).getTime())
            reject('Start date must be before end date');
        const sql = "select K.id, K.model, K.brand, K.category from cars K inner join (select * from cars except select C.id, C.model, C.brand, C.category from cars C inner join rentals R on C.id = R.car where (R.startDate between ? and ?) or (R.endDate between ? and ?)) A on A.id = K.id where K.category=?";
        db.all(sql, [startDate, endDate, startDate, endDate, category], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let cars = rows.map((row) => createCar(row));
                resolve(cars);
            }
        });
    });
}