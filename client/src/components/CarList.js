import React from 'react';
import Table from 'react-bootstrap/Table';

const CarList = (props) => {

    const listCars = (car) => {
        let test = (((props.brands_filter.includes(car.brand)) || (props.brands_no_filter)) && ((props.categories_filter.includes(car.category)) || (props.categories_no_filter)))
        return (
            <>{test &&
                <tr key={car.id}>
                    <td>{car.model}</td>
                    <td>{car.brand}</td>
                    <td>{car.category}</td>
                </tr>}
            </>
        )
    }

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Model</th>
                    <th>Brand</th>
                    <th>Category</th>
                </tr>
            </thead>
            <tbody>
                {props.cars.map(listCars)}
            </tbody>
        </Table>
    )
}

export default CarList;