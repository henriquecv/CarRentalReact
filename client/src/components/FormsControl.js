import React from 'react';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import RentForm from './RentForm.js';
import PaymentForm from './PaymentForm.js';


class FormsControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: moment().format("YYYY[-]MM[-]DD"), endDate: '', category: 'A', age: null, extra_drivers: 0, km_day: null, insurance: 'Yes', price: null, submitted1: false,
            fullName: '', cardNumber: '', CVV: '', submitted2: false
        };
    }

    updateField1 = (name, value) => {
        this.setState({ [name]: value, submitted1: false });
    }

    updateField2 = (name, value) => {
        this.setState({ [name]: value });
    }

    handleSubmit1 = (event) => {
        event.preventDefault();
        this.props.getAvailableCars(this.state.startDate, this.state.endDate, this.state.category);
        this.calculatePrice(this.state.startDate, this.state.endDate, this.state.category, this.state.age, this.state.extra_drivers, this.state.km_day, this.state.insurance);
        this.setState({ submitted1: true });
    }

    handleSubmit2 = (event) => {
        event.preventDefault();
        this.props.makePayment(this.state.startDate, this.state.endDate, this.props.authUser.id, this.props.available_cars[0].id, this.state.age, this.state.extra_drivers, this.state.km_day, this.state.insurance, this.state.fullName, this.state.cardNumber, this.state.CVV, this.state.price);
        this.setState({submitted2: true});
    }

    filterCarsByCategory = (cars, category) => {
        return (cars.filter((c) => c.category === category));
    }

    isFrequentUser = (rentals) => {
        let count = 0;
        for (let rental of rentals) {
            if (rental.endDate.isBefore(moment().subtract(1, 'days')))
                count += 1;
        }
        return (count >= 3);
    }

    calculatePrice = (startDate, endDate, category, age, extra_drivers, km_day, insurance) => {
        startDate = moment(startDate);
        endDate = moment(endDate);
        age = parseInt(age);
        extra_drivers = parseInt(extra_drivers);
        const numTotCars = this.filterCarsByCategory(this.props.cars, category).length;
        if (!km_day)
            km_day = 150;
        km_day = parseInt(km_day);
        let totDays = endDate.diff(startDate, 'days') + 1;
        let price = null;
        switch (category) {
            case "A":
                price = 80 * totDays;
                break;
            case "B":
                price = 70 * totDays;
                break;
            case "C":
                price = 60 * totDays;
                break;
            case "D":
                price = 50 * totDays;
                break;
            case "E":
                price = 40 * totDays;
                break;
        }
        if (km_day < 50) {
            price = price * 0.95;
        } else if (km_day >= 150 || km_day === null) {
            price = price * 1.05;
        }
        if (age < 25) {
            price = price * 1.05;
        } else if (age > 65) {
            price = price * 1.1;
        }
        if (extra_drivers >= 1)
            price = price * 1.15;
        if (insurance === 'Yes')
            price = price * 1.2;
        if (this.props.available_cars.length / numTotCars < 0.1)
            price = price * 1.1;
        if (this.isFrequentUser(this.props.rentals))
            price = price * 0.9;

        this.setState({ price: price.toFixed(2) });
    }

    render() {
        return (
            <>
                {!this.props.authUser && <Redirect to="/login" />}
                {this.props.authUser && <h1>Fill the form to rent a car</h1>}
                {this.props.authUser && <RentForm categories={this.props.categories} startDate={this.state.startDate} endDate={this.state.endDate} category={this.state.category} age={this.state.age} extra_drivers={this.state.extra_drivers} km_day={this.state.km_day} insurance={this.state.insurance} updateField={this.updateField1} handleSubmit={this.handleSubmit1} getAvailableCars={this.props.getAvailableCars} />}
                {this.props.authUser && this.state.submitted1 && <p>Number of available cars: {this.props.available_cars.length} </p>}
                {this.props.authUser && this.state.submitted1 && <p>Price: {this.state.price} € </p>}
                {this.state.submitted1 && (this.props.available_cars.length>0) && <h3>Insert your credit card informations</h3>}
                {this.state.submitted1 && (this.props.available_cars.length>0) && <PaymentForm handleSubmit={this.handleSubmit2} updateField={this.updateField2} fullName={this.state.fullName} cardNumber={this.state.cardNumber} CVV = {this.state.CVV} />}
                {this.state.submitted1 && this.state.submitted2 && this.props.payment_status === "success" && <h3>Your reservation is confirmed!</h3>}
                {this.state.submitted1 && this.state.submitted2 && this.props.payment_status !== "success" && <h3>{this.props.payment_status}</h3>}
            </>
        )
    }
}
export default FormsControl;