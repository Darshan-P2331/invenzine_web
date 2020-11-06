import React, {Component} from 'react'
import { Navbar, Nav, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import firebase, {firestore} from '../firebase'

class NavBar extends Component {
    constructor() {
        super()
        this.logout = this.logout.bind(this)
        this.state={
            admin: false
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
                            admin: info.data().SuperAdmin
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
            <Navbar expand="md">
                <Navbar.Brand style={{padding: '0', fontSize: '2rem'}}>INV<span style={{ color: 'rgba(255,216,0,0.9)'}}>E</span>NZINE</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="mr-2">
                    <Nav className="ml-auto mr-3">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/profile">Profile</Nav.Link>
                        <Nav.Link href="/Search">Search</Nav.Link>
                        {this.state.admin ?<Nav.Link href="/admin">Admin</Nav.Link> : <div/>}
                    </Nav>
                    {!firebase.auth().currentUser ? 
                        <Button variant="outline-warning" href="/signin">Sign In</Button>
                        :
                        <Button variant="danger" onClick={this.logout} href='/'>Log Out</Button>
                    }
                    
                </Navbar.Collapse>
            </Navbar>
            
        )
    }
}

export default NavBar