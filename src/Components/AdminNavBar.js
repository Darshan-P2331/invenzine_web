import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Navbar, Nav, Button } from "react-bootstrap";
import { faArrowCircleLeft, faChartPie, faFile, faPlus, faTag, faUser } from '@fortawesome/free-solid-svg-icons';
import firebase, { firestore } from '../firebase'

class AdminNavBar extends Component {
    constructor() {
        super()
        this.state = {
            super: false
        }
        this.logout = this.logout.bind(this)
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            firestore.collection('Super').doc(user.email).get().then(info => {
                if (info.exists) {
                    this.setState({
                        super: info.data().SuperAdmin ? info.data().SuperAdmin : false
                    })
                    console.log(this.state.super);
                }
            })
        })
    }

    logout() {
        firebase.auth().signOut().then(() => {
            console.log('Loged Out successfully');
        })
    }

    render() {
        return (
            <div>
                <Navbar expand="md" variant='dark' bg='dark'>
                    <Nav.Link href='/'><FontAwesomeIcon icon={faArrowCircleLeft} size='2x' color='white' />&nbsp;</Nav.Link>
                    <Navbar.Brand>Admin Panel</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="mr-2">
                        <Nav fill variant='pills' className='ml-auto mr-2' defaultActiveKey={this.props.location.pathname}>
                        {this.state.super ? <Nav.Link eventKey='/admin/addadmin' href='/admin/addadmin' ><FontAwesomeIcon icon={faUser} /> Admin</Nav.Link> : <div />}
                            {this.state.super? "" : <Nav.Link href='/admin' ><FontAwesomeIcon icon={faChartPie} /> Dashboard</Nav.Link>}
                            <Nav.Link eventKey='/admin/addpost' href='/admin/addpost' ><FontAwesomeIcon icon={faPlus} /> Add Post</Nav.Link>
                            <Nav.Link eventKey='/admin/draft' href='/admin/draft' ><FontAwesomeIcon icon={faFile} /> Draft</Nav.Link>                            
                            {this.state.super ? <Nav.Link eventKey='/admin/addcategory' href='/admin/addcategory' ><FontAwesomeIcon icon={faTag} /> Category</Nav.Link> : <div />}
                        </Nav>
                        <Button variant="danger" onClick={this.logout} href='/'>Log Out</Button>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}

export default AdminNavBar
