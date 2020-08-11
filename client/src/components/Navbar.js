import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Header = (props) => {
    return (
        <Navbar bg="dark" variant="dark" fixed="top">
            <NavLink to="/home">
                <Navbar.Brand>
                    CarRental
                    </Navbar.Brand>
            </NavLink>
            <Nav className="mr-auto">
                <Nav.Link as={NavLink} to="/renthere">Rent Here!</Nav.Link>
                <Nav.Link as={NavLink} to="/myrentals" onClick = {() => props.getUserRentals()}>My rentals</Nav.Link>
            </Nav>
            <Nav className="ml-auto">
                {!props.authUser && <Nav.Link as={Link} to="/login">
                    Log In
                </Nav.Link>}
                {props.authUser && <Nav.Link onClick = {() => {props.logoutUser()}}>
                    Log out
                </Nav.Link>}
            </Nav>
        </Navbar>
    )
}

export default Header;
