import React from 'react';
import Table from 'react-bootstrap/Table';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import Button from 'react-bootstrap/Button';


const RentalList = (props) => {

    const listRentals = (rental) => {
        //let test = (((props.brands_filter.includes(car.brand)) || (props.brands_no_filter)) && ((props.categories_filter.includes(car.category)) || (props.categories_no_filter)))

        return (
            <>  <tr key={rental.id}>
                <td>{rental.startDate.format("dddd, MMMM Do YYYY")}</td>
                <td>{rental.endDate.format("dddd, MMMM Do YYYY")}</td>
                <td>{rental.car_model}</td>
                <td>{rental.car_category}</td>
                <td>{rental.driverAge}</td>
                <td>{rental.extraDrivers}</td>
                {rental.km_day && <td>{rental.km_day}</td>}
                {!rental.km_day && <td>Unlimitted</td>}
                <td>{rental.insurance}</td>
                <td>{rental.price}</td>
                {rental.endDate.isBefore(moment().subtract(1, 'days')) && <td>Finished</td>}
                {!rental.endDate.isBefore(moment().subtract(1, 'days')) && <td>Future</td>}
                {rental.startDate.isAfter(moment()) && <td><Button variant="outline-danger" onClick={() => props.deleteRental(rental.id)} >Cancel</Button></td>}
                {!rental.startDate.isAfter(moment()) && <td>---</td>}
            </tr>
            </>
        )
    }

    return (
        <>
            {props.authUser && <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Car Model</th>
                        <th>Car Category</th>
                        <th>Main driver's age</th>
                        <th>Number of extra drivers</th>
                        <th>Estimated km/day</th>
                        <th>Extra insurance</th>
                        <th>Price (€)</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {props.rentals.map(listRentals)}
                </tbody>
            </Table>}

            {!props.authUser && <Redirect to="/login"/> }
        </>
    )
}

export default RentalList;