import React from 'react';
import './App.css';
import Header from './components/Navbar.js';
import Filters from './components/Filters.js';
import CarList from './components/CarList.js';
import LoginForm from './components/LoginForm.js';
import FormsControl from './components/FormsControl.js';
import { Redirect, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import { withRouter } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import API from './api/api.js';
import RentalList from './components/RentalList';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { categories: ["A", "B", "C", "D", "E"], brands: [], categories_filter: [], brands_filter: [], cars: [], available_cars: [], rentals: [], categories_no_filter: true, brands_no_filter: true, payment_status: null };
  }

  // Loads cars from database and checks if user is logged in
  componentDidMount() {
    API.getCars().then(
      (cars) => this.setState({ cars: cars, brands: this.getBrands(cars) }));
    API.isAuthenticated().then(
      (user) => {
        this.setState({ authUser: user });
      }
    ).catch((err) => {
      this.setState({ authErr: err.errObj });
      this.props.history.push("/home");
    });
  }

  login = (nickname, password) => {
    API.userLogin(nickname, password).then(
      (user) => {
        this.setState({ authUser: user, authErr: null });
      }
    ).catch(
      (errorObj) => {
        const err0 = errorObj.errors[0];
        this.setState({ authErr: err0 });
      }
    );
  }

  logout = () => {
    API.userLogout().then(() => {
      this.setState({ rentals: [], authUser: null, authErr: { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] } });
      this.props.history.push("/home");
    });
  }

// Function that updates the filter for categories
  updateCategories = (category, checked) => {
    if (checked) {
      this.setState(state => {
        const field = [...state.categories_filter, category];
        return { categories_filter: field, categories_no_filter: false }
      })
    }
    else {
      this.setState(state => {
        const field = state.categories_filter.filter(el => el != category);
        const filter = (field.length === 0);
        return { categories_filter: field, categories_no_filter: filter };
      })
    }
  }

  // Function that updates the filter for brands
  updateBrands = (brand, checked) => {
    if (checked) {
      this.setState(state => {
        const field = [...state.brands_filter, brand];
        return { brands_filter: field, brands_no_filter: false }
      })
    }
    else {
      this.setState(state => {
        const field = state.brands_filter.filter(el => el != brand);
        const filter = (field.length === 0);
        return { brands_filter: field, brands_no_filter: filter };
      })
    }
  }

// Creates a Set with all the brands on the DB
  getBrands(cars) {
    return [...new Set(cars.map((car) => {
      if (car.brand)
        return car.brand;
      else
        return null;
    }))];
  }

  // Get all the rentals for the logged in user, called everytime the user clicks on "My rentals"
  getUserRentals = () => {
    API.getRentals()
      .then((rentals) => this.setState({rentals: rentals}))
      .catch((err) => {
        this.setState({authUser: null, authErr: err.errObj, rentals: []});
            //this.props.history.push("/login");
      });
  }

  // Gets all available cars for a given time period and category, called everytime the rental form is submitted
  getAvailableCars = (startDate, endDate, category) => {
    API.getAvailableCars(startDate, endDate, category)
      .then((cars) => this.setState({available_cars: cars}))
      .catch((err) => {
        this.setState({authErr: err.errObj, available_cars: []});
        this.props.history.push("/login");
      })
  }

  // Function that calls 2 APIs: make the proceses the oayment and, in case of success, adds the rental to the DB
  makePayment = (startDate, endDate, user_id, car_id, driverAge, extraDrivers, km_day, insurance, name, number, CVV, price) => {
    API.makePayment(name, number, CVV, price)
      .then((obj) => {
        API.addRental(startDate, endDate, user_id, car_id, driverAge, extraDrivers, km_day, insurance, price)
          .then((id) => this.setState({payment_status: obj.msg}))})
      .catch((err) => this.setState({payment_status: err.errors[0].msg}));
  }

  deleteRental = (rentalId) => {
    API.deleteRental(rentalId)
      .then(() => {
        API.getRentals().then((rentals) => this.setState({rentals: rentals}))
                        .catch((err) => this.setState({authErr: err.errObj, rentals: []}));})
      .catch((err) => this.setState({authErr: err}));
  }

  render() {
    return (
      <>
        <Header logoutUser={this.logout} authUser={this.state.authUser} getUserRentals = {this.getUserRentals} />
        <Container fluid>
          <Switch>

            <Route exact path="/home">
              <Row>
                <Col sm={3} bg="light" id="left-sidebar" className="below-nav">
                  <Filters categories={this.state.categories} brands={this.state.brands} categories_filter={this.state.categories_filter} brands_filter={this.state.brands_filter} updateCategories={this.updateCategories} updateBrands={this.updateBrands}></Filters>
                </Col>
                <Col sm={8} className="below-nav">
                  <h1>Our Garage</h1>
                  <CarList cars={this.state.cars} categories_filter={this.state.categories_filter} brands_filter={this.state.brands_filter} categories_no_filter={this.state.categories_no_filter} brands_no_filter={this.state.brands_no_filter} />
                </Col>
              </Row>
            </Route>

            <Route exact path="/myrentals">
              <Col sm={8} className="below-nav">
                <h1>My rentals </h1>
                <RentalList authUser = {this.state.authUser} rentals = {this.state.rentals} deleteRental = {this.deleteRental}/>
              </Col>
            </Route>

            <Route exact path="/renthere">
              <Col sm={8} className="below-nav">
                <FormsControl makePayment = {this.makePayment} payment_status = {this.state.payment_status} authUser = {this.state.authUser} rentals = {this.state.rentals} categories = {this.state.categories} cars = {this.state.cars} available_cars={this.state.available_cars} getAvailableCars={this.getAvailableCars}/>
              </Col>
            </Route>

            <Route exact path="/login">
              <Row className="vheight-100">
                <Col sm={4}></Col>
                <Col sm={4} className="below-nav">
                  <LoginForm authErr={this.state.authErr} loginUser={this.login} />
                </Col>
              </Row>
            </Route>

            <Route>
              <Redirect to='/home' />
            </Route>

          </Switch>

        </Container>
      </>
    );
  }
}

export default withRouter(App);

