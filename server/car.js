class Car{    
    constructor(id, model, brand, category) {
        if(id)
            this.id = id;

        this.model = model;
        this.brand = brand;
        this.category = category;
    }
}

module.exports = Car;