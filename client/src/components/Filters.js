import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';

class Filters extends React.Component {

    constructor(props) {
        super(props);
    }

    listCategories = (category) => {
        return (
            <Form.Group controlId="category" key={category}>
                <Form.Check type="checkbox" label={category} id={category} name={category} checked = {this.props.categories_filter.includes(category)} onChange={(ev) => this.props.updateCategories(ev.target.name, ev.target.checked)} />
            </Form.Group>
        );
    }

    listBrands = (brand) => {
        return (
            <Form.Group controlId="brand" key={brand}>
                <Form.Check type="checkbox" label={brand} id={brand} name={brand} checked = {this.props.brands_filter.includes(brand)} onChange={(ev) => this.props.updateBrands(ev.target.name, ev.target.checked)} />
            </Form.Group>
        )
    }

    render(){
        return(
            <ListGroup  variant="flush">
                <ListGroup.Item className="list-title">Categories</ListGroup.Item>
                {this.props.categories.map(this.listCategories)}
                <ListGroup.Item className="list-title">Brands</ListGroup.Item>
                {this.props.brands.map(this.listBrands)}
            </ListGroup>
        )
    }
}

export default Filters;
