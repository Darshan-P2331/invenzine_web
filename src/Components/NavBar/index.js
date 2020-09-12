import React, {Component} from 'react'
import { Navbar, Nav, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import firebase, {logout} from '../../firebase'

class NavBar extends Component {
    render() {
        return (
            <Navbar expand="md">
                <Navbar.Brand>INVENZINE</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="mr-2">
                    <Nav className="ml-auto mr-3">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/profile">Profile</Nav.Link>
                    </Nav>
                    {firebase.auth().currentUser === null ? 
                        <Button variant="outline-warning" href="/signin">Sign In</Button>
                        :
                        <Button variant="danger" onClick={logout}>Log Out</Button>
                    }
                    
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default NavBar