import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import moment from 'moment';

const RentForm = (props) => {
    return (
        <Form method="POST" onSubmit={(event) => props.handleSubmit(event)}>
            <Form.Row>
                <Form.Group as={Col} controlId="startDate">
                    <Form.Label>Starting Day</Form.Label>
                    <Form.Control type="date" name="startDate" min={moment().format("YYYY[-]MM[-]DD")} value={props.startDate} onChange={(ev) => props.updateField(ev.target.name, ev.target.value)} required />
                </Form.Group>

                <Form.Group as={Col} controlId="endDate">
                    <Form.Label>Ending Day</Form.Label>
                    <Form.Control type="date" name="endDate" min={props.startDate} value={props.endDate} onChange={(ev) => props.updateField(ev.target.name, ev.target.value)} required />
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Control name="category" as="select" defaultValue="A" onChange={(ev) => props.updateField(ev.target.name, ev.target.value)} required>
                        {props.categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </Form.Control>
                </Form.Group>
                <Form.Group as={Col} controlId="age">
                    <Form.Label>Main driver's age</Form.Label>
                    <Form.Control placeholder="Driver's age" type="number" min={18} name="age" value={props.age} onChange={(ev) => props.updateField(ev.target.name, ev.target.value)} required />
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} controlId="extra_drivers">
                    <Form.Label>Number of extra drivers</Form.Label>
                    <Form.Control placeholder="Number of extra drivers" type="number" min={0} name="extra_drivers" value={props.extra_drivers} onChange={(ev) => props.updateField(ev.target.name, ev.target.value)} required />
                </Form.Group>
                <Form.Group as={Col} controlId="insurance">
                    <Form.Label>Extra Insurance</Form.Label>
                    <Form.Control name="insurance" as="select" defaultValue="Yes" onChange={(ev) => props.updateField(ev.target.name, ev.target.value)} required>
                        <option>Yes</option>
                        <option>No</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group as={Col} controlId="km_day">
                    <Form.Label>Estimated km/day</Form.Label>
                    <Form.Control placeholder="Enter the estimation" type="number" min={0} name="km_day" value={props.km_day} onChange={(ev) => props.updateField(ev.target.name, ev.target.value)} />
                </Form.Group>
            </Form.Row>

            <Button variant="primary" type="submit">
                Check price and availability
            </Button>
        </Form>
    )
}



export default RentForm;