// This class has two attributes in addiction to the ones present on the rentals table in the DB: car_model and car_category

class Rental {
    constructor(id, startDate, endDate, user_id, car_id, car_model, car_category, driverAge, extraDrivers, km_day, insurance, price) {
        if (id)
            this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.user_id = user_id;
        this.car_id = car_id;
        this.car_model = car_model;
        this.car_category = car_category;
        this.driverAge = driverAge;
        this.extraDrivers = extraDrivers;
        this.km_day = km_day;
        this.insurance = insurance
        this.price = price;
    }
}

module.exports = Rental;