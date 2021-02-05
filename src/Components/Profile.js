import React, { Component } from 'react'
import firebase from '../firebase'
import { Container, Card, Image, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import NavBar from './NavBar'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import Footer from './Footer'

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "",
            email: "",
            photoUrl: "",
            isLogedIn: false,
            verified: false
        }
        this.resetPassword = this.resetPassword.bind(this)
        this.verification = this.verification.bind(this)
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    name: user.displayName,
                    email: user.email,
                    isLogedIn: true,
                    photoUrl: user.photoURL,
                    verified: user.emailVerified
                })
            }
        })
    }

    resetPassword(email) {
        if (email !== null) {
            firebase.auth().sendPasswordResetEmail(email).then(() => alert("Check your Email"))
        }
    }
    verification() {
        firebase.auth().currentUser.sendEmailVerification()
    }

    logout() {
        firebase.auth().signOut()

    }
    render() {
        return this.state.isLogedIn === true ? (
            <div>
                <NavBar />
                <div className='profile'>
                <Container>
                    <div className="d-flex justify-content-center">
                        <div className="d-flex flex-column">
                            <Card className="card" style={{marginTop: '50%'}}>
                                <Image src={this.state.photoUrl || './Profile.png'} roundedCircle className="img" />
                                <Card.Title className="username">{this.state.name}</Card.Title>
                                <Card.Text className="email">{this.state.email ? this.state.email : ''}{this.state.verified ? <FontAwesomeIcon icon={faCheckCircle} color='green' title='verified' /> : <FontAwesomeIcon icon={faCheckCircle} color='red' title='not verified' />}</Card.Text>
                                {!this.state.verified ? <Link onClick={this.verification}>Send verification link</Link> : ''}
                                {this.state.email ? <Link onClick={e => this.resetPassword(this.state.email)}>Reset Password ?</Link> : ''}
                                <Button className="btn btn-danger logout" onClick={this.logout} href='/profile'>Log Out</Button>
                            </Card>
                        </div>
                    </div>
                </Container>
                </div>
            </div>
        ) : (
                <div>
                    <video autoPlay muted loop>
                        <source src='circuit.mp4' type='video/mp4' />
                    </video>
                    <NavBar />
                    <Container>
                        <div className="text-white">
                            <div className="d-flex justify-content-center">
                                <div className='text-center' style={{marginTop: '40vh',marginBottom: '30vh'}}>
                                    <h3>Please Sign In to View your Profile</h3>
                                    <Button className="btn btn-success" href="/signin">Sign In</Button>
                                </div>                                
                            </div>

                        </div>
                    </Container>
                    <Footer/>
                </div>
            )
    }
}

export default Profile