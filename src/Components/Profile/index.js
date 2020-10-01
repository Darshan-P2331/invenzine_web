import React, { Component } from 'react'
import firebase from '../../firebase'
import { Container, Card, Image, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import NavBar from '../NavBar'

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "",
            email: "",
            photoUrl: "",
            isLogedIn: false
        }
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
                            <Card className="card">
                                <Image src={this.state.photoUrl} roundedCircle className="img" />
                                <Card.Title className="username">{this.state.name}</Card.Title>
                                <Card.Text className="email">{this.state.email}</Card.Text>
                                <Button className="btn btn-danger logout" onClick={this.logout}>Log Out</Button>
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