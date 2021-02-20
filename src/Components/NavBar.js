import React, {Component} from 'react'
import { Navbar, Nav, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import firebase, {firestore} from '../firebase'

class NavBar extends Component {
    constructor() {
        super()
        this.logout = this.logout.bind(this)
        this.state={
            admin: false,
            super: false
        }
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                firestore.collection('LocalAdmins').doc(user.email).get().then(info => {
                    if (info.exists) {
                        this.setState({
                            admin: info.data().ApprovalStatus
                        })
                    }
                })
                firestore.collection('Super').doc(user.email).get().then(info => {
                    if (info.exists) {
                        this.setState({
                            admin: info.data().SuperAdmin,
                            super: info.data().SuperAdmin,
                        })
                        console.log(info.data().SuperAdmin);
                    }
                })
            console.log(this.state.admin);
        }
        })
    }

    logout() {
        firebase.auth().signOut().then(() => {
            console.log('Loged Out successfully');
        })
    }

    render() {
        return (
            <Navbar expand="md" style={{backgroundColor: '#000'}} variant='dark'>
                <Navbar.Brand style={{padding: '0', fontSize: '2rem', fontWeight: '500'}}>INVEN<span style={{ color: 'yellow'}}>Z</span>INE</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="mr-2">
                    <Nav>
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/profile">Profile</Nav.Link>
                        <Nav.Link href="/Search">Search</Nav.Link>
                        <Nav.Link href="/about">About Us</Nav.Link>
                        <Nav.Link href="/contact">Contact Us</Nav.Link>
                        {this.state.admin ?<Nav.Link href={this.state.super? "/admin/addadmin" : "/admin"}>Admin</Nav.Link> : <div/>}
                    </Nav>
                    <div className='ml-auto'>
                    {!firebase.auth().currentUser ? 
                        <Button variant="outline-warning" href="/signin">Sign In</Button>
                        :
                        <Button variant="outline-danger" className='text-white' onClick={this.logout} href='/'>Log Out</Button>
                    }
                    </div>
                </Navbar.Collapse>
            </Navbar>
            
        )
    }
}

export default NavBar