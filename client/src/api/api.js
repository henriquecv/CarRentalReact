import Car from './Car.js';
import User from './User.js';
import Rental from './Rental.js';

async function isAuthenticated(){
    const response = await fetch("/api/user");
    const userJson = await response.json();
    if(response.ok){
        return new User(userJson.id, userJson.nickname, userJson.name, userJson.lastname, userJson.hash)
    } else {
        let err = {status: response.status, errObj:userJson};
        throw err;  // An object with the error coming from the server
    }
}

async function getCars() {
    const response = await fetch("api/cars");
    const carsJson = await response.json();
    if(response.ok){
        return carsJson.map((c) => new Car(c.id, c.model, c.brand, c.category));
    } else {
        let err = {status: response.status, errObj:carsJson};
        throw err;  // An object with the error coming from the server
    }
}

async function getAvailableCars(startDate, endDate, category) {
    const queryParams = '?startDate=' + startDate + '&endDate=' + endDate + '&category=' + category;
    const response = await fetch("api/cars/available" + queryParams);
    const carsJson = await response.json();
    if(response.ok) {
        return carsJson.map((c) => new Car(c.id, c.model, c.brand, c.category));
    } else {
        let err = {status: response.status, errObj:carsJson};
        throw err;
    }
}

async function userLogin(nickname, password) {
    return new Promise((resolve, reject) => {
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({nickname: nickname, password: password}),
        }).then((response) => {
            if (response.ok) {
                response.json().then((u) => {
                    resolve(new User(u.id, u.nickname, u.name, u.lastname, u.hash));
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function userLogout() {
    return new Promise((resolve, reject) => {
        fetch('/api/logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        });
    });
}

// Get the rentals for the logged in user (the id of the logged in user is passed on cookie)
async function getRentals() {
    const response = await fetch("api/rentals");
    const rentalsJson = await response.json();
    if(response.ok){
        //return tasksJson.map((t) => Task.from(t));
        return rentalsJson.map((r) => new Rental(r.id, r.startDate, r.endDate, r.user_id, r.car_id, r.car_model, r.car_category, r.driverAge, r.extraDrivers, r.km_day, r.insurance, r.price));
    } else {
        let err = {status: response.status, errObj:rentalsJson};
        throw err;  // An object with the error coming from the server
    }
}

// Calling the stub API for fake payment
async function makePayment (name, number, CVV, price) {
    return new Promise((resolve, reject) => {
        fetch('/api/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: name, number: number, CVV: CVV, price: price}),
        }).then((response) => {
            if (response.ok) {
                response.json().then((status) => {
                    resolve(status);
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function addRental (startDate, endDate, user_id, car_id, driverAge, extraDrivers, km_day, insurance, price) {
    return new Promise((resolve, reject) => {
        fetch('/api/rentals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({startDate: startDate, endDate: endDate, user_id: user_id, car_id: car_id, driverAge: driverAge, extraDrivers: extraDrivers, km_day: km_day, insurance: insurance, price: price}),
        }).then((response) => {
            if (response.ok) {
                response.json().then((id) => {
                    resolve(id);
                });
            } else {
                response.json()
                    .then((obj) => { reject(obj);})
                    .catch((err) => { reject({errors: [{param: "Application", msg: "Cannot parse server response"}]})});
            }
        }).catch((err) => { reject({errors: [{param: "Server", msg: "Cannot communicate"}]})});
    });
}

async function deleteRental(rentalId) {
    return new Promise((resolve, reject) => {
        fetch("api/rentals/" + rentalId, {
            method: 'DELETE'
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

const API = { isAuthenticated, getCars, getAvailableCars, userLogin, userLogout, getRentals, makePayment, addRental, deleteRental } ;
export default API;