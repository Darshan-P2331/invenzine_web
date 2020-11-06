import React, { Component } from 'react'
import firebase from '../firebase'
import { Container, Card, Image, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import NavBar from './NavBar'
import { Link } from 'react-router-dom'

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "",
            email: "",
            photoUrl: "",
            isLogedIn: false
        }
        this.resetPassword = this.resetPassword.bind(this)
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    name: user.displayName,
                    email: user.email,
                    isLogedIn: true,
                    photoUrl: user.photoURL
                })
            }
        })
    }

    resetPassword(email) {
        if (email !== null) {
            firebase.auth().sendPasswordResetEmail(email).then(() => alert("Check your Email"))
        }
    }

    logout() {
        firebase.auth().signOut()

    }
    render() {
        return this.state.isLogedIn === true ? (
            <div>
                <NavBar />
                <Container>
                    <div className="d-flex justify-content-center">
                        <div className="d-flex flex-column">
                            <Card className="card" style={{marginTop: '50%'}}>
                                <Image src={this.state.photoUrl || './Profile.png'} roundedCircle className="img" />
                                <Card.Title className="username">{this.state.name}</Card.Title>
                                <Card.Text className="email">{this.state.email ? this.state.email : ''}</Card.Text>
                                {this.state.email ? <Link onClick={e => this.resetPassword(this.state.email)}>Reset Password ?</Link> : ''}
                                <Button className="btn btn-danger logout" onClick={this.logout} href='/profile'>Log Out</Button>
                            </Card>
                        </div>
                    </div>
                </Container>
            </div>
        ) : (
                <div>
                    <NavBar />
                    <Container>
                        <div className="justify-content-center">
                            <div className="d-flex flex-column button">
                                <h3>Please Sign In to View your Profile</h3>
                                <Button className="btn btn-success" href="/signin">Sign In</Button>
                            </div>

                        </div>
                    </Container>
                </div>
            )
    }
}

export default Profile