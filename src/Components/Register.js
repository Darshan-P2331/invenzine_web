import React, { Component } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import firebase, { firestore } from '../firebase'

class Register extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Email: '',
            Address: '',
            Username: '',
            PhoneNumber: '',
            IDProof: '',
            Occupation: '',
            applied: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user.emailVerified) {
                this.setState({
                    Email: user.email,
                    Username: user.displayName
                })
                firestore.collection('LocalAdmins').doc(user.email).get().then(doc => {
                    if (doc.exists) {
                        this.setState({
                            applied: true
                        })
                    }
                })
            } else {
                alert('Verify your email first')
                this.props.history.push('/')
            }
        })
    }

    handleChange(value, name) {
        this.setState({ [name]: value })
    }

    handleSubmit() {
        firestore.collection('LocalAdmins').doc(this.state.Email).set({
            Email: this.state.Email,
            Address: this.state.Address,
            Username: this.state.Username,
            PhoneNumber: this.state.PhoneNumber,
            IDProof: this.state.IDProof,
            Occupation: this.state.Occupation,
            ApprovalStatus: false,
            photoUrl: "",
            Subscribers: []
        }).then(() => {
            alert('Submited')
            this.props.history.push('/')
        })
    }

    render() {
        return (
            <Container className="py-4">
                {!this.state.applied ?
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" disabled placeholder="Enter email" value={this.state.Email} onChange={e => this.handleChange(e.target.value, 'Email')} />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" disabled placeholder="Name" value={this.state.Username} onChange={e => this.handleChange(e.target.value, 'UserName')} />
                        </Form.Group>
                        <Form.Group controlId="formID">
                            <Form.Label>ID Proof</Form.Label>
                            <Form.Control type="text" value={this.state.IDProof} onChange={e => this.handleChange(e.target.value, 'IDProof')} placeholder="ID Proof" />
                        </Form.Group>
                        <Form.Group controlId="formPhone">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control maxLength='10' type="tel" value={this.state.PhoneNumber} placeholder="Phone Number" onChange={e => this.handleChange(e.target.value, 'PhoneNumber')} />
                        </Form.Group>
                        <Form.Group controlId="formPhone">
                            <Form.Label>Occupation</Form.Label>
                            <Form.Control placeholder="Occupation" pattern="[A-Z][a-z]" value={this.state.Occupation} onChange={e => this.handleChange(e.target.value, 'Occupation')} />
                        </Form.Group>
                        <Form.Group controlId="Adress">
                            <Form.Label>Address</Form.Label>
                            <Form.Control as="textarea" rows={3} value={this.state.Address} onChange={e => this.handleChange(e.target.value, 'Address')} />
                        </Form.Group>
                        <Button variant="primary" onClick={this.handleSubmit}>Submit</Button>
                    </Form>
                    :
                    <div className='d-flex justify-content-center'>
                        <div className='d-flex flex-column'>
                            <h1 className='text-secondary' style={{ marginTop: '250%' }}>Applied</h1>
                        </div>
                    </div>
                }
            </Container>
        )
    }
}

export default Register
