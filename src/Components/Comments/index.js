import React, { Component } from "react";
import { Col, Button, Card, Form } from "react-bootstrap";
import firebase from '../../firebase'

class Comment extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: "",
            comment: "",
            boards: [],
        };
        this.addComment = this.addComment.bind(this)
    }

    static getDerivedStateFromProps(props, state) {
        return { id: props.id };
    }

    componentDidUpdate() {
        const dbref = firebase.firestore().collection('News').doc(this.state.id).collection('Comments')
        dbref.onSnapshot((querySnapshot) => {
            const board = []
            querySnapshot.forEach((docs) => {
                board.push(docs.data())
            })
            this.setState({
                boards: board
            })
        })
    }
    addComment(e) {
        e.preventDefault()
        firebase.firestore().collection('News').doc(this.state.id).collection('Comments').add({
            Comment: this.state.comment,
            userName: firebase.auth().currentUser.displayName
        }).then(function (docref) {
            console.log(docref.id)
        })
        this.setState({
            comment: ''
        })
    }

    render() {
        return (
            <Col>
                { firebase.auth().currentUser !== null ?
                    <Form onSubmit={this.addComment}>
                        <Form.Group controlId='formBasicComment'>
                            <Form.Control placeholder="Add Comment" value={this.state.comment} onChange={(e) => this.setState({ comment: e.target.value })} />
                        </Form.Group>
                        <Button type="submit">Submit</Button>
                    </Form>
                    :
                    <Form>
                        <Form.Group controlId='formBasicComment'>
                            <Form.Control disabled placeholder="Login to add comments" value={this.state.comment} onChange={(e) => this.setState({ comment: e.target.value })} />
                        </Form.Group>
                        <Button type="submit" disabled>Submit</Button>
                    </Form>
                }
                    {this.state.boards.map((board) => (
                        <div>
                            <Card.Body>
                                <Card.Title>{board.Comment}</Card.Title>
                                <Card.Text>{board.userName}</Card.Text>
                            </Card.Body>
                            <hr/>
                        </div>   
                    ))}
            </Col>
        );
    }
}

export default Comment;
