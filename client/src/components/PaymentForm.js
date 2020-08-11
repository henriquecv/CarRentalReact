import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const PaymentForm = (props) => {
    return (
        <Form method="POST" onSubmit={(event) => props.handleSubmit(event, props.getAvailableCars)}>
            <Form.Row>
                <Form.Group as={Col} controlId="fullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control name="fullName" type="text" placeholder="Insert your full name" value={props.fullName} onChange={(ev) => props.updateField(ev.target.name, ev.target.value)} required/>
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} controlId="cardNumber">
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control name="cardNumber" type="text" placeholder="Ex.: 1234 1234 1234 1234" value={props.cardNumber} onChange={(ev) => props.updateField(ev.target.name, ev.target.value)} required/>
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} controlId="CVV">
                    <Form.Label>CVV code</Form.Label>
                    <Form.Control name="CVV" type="text" placeholder="Ex.: 123" value={props.CVV} onChange={(ev) => props.updateField(ev.target.name, ev.target.value)} required/>
                </Form.Group>
            </Form.Row>

            <Button variant="primary" type="submit">
                Pay
            </Button>

        </Form>
    )
}

export default PaymentForm;