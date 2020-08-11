'use strict';

const User = require('./user.js');
const db = require('./db.js');
const bcrypt = require('bcrypt');

const createUser = function (row) {
    return new User(row.id, row.nickname, row.name, row.lastname, row.hash);
}

exports.getUser = function (nickname) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE nickname = ?"
        db.all(sql, [nickname], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                const user = createUser(rows[0]);
                resolve(user);
            }
        });
    });
};

exports.getUserById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE id = ?"
        db.all(sql, [id], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                const user = createUser(rows[0]);
                resolve(user);
            }
        });
    });
};

exports.checkPassword = function(user, password){
    if (!password)
        return false;
    return bcrypt.compareSync(password, user.hash);
}