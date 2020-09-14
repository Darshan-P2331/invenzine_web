import React, { Component } from "react";
import { Col, Button, Card, InputGroup, FormControl } from "react-bootstrap";
import firebase from '../../firebase'

class Comment extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: "",
            comment: "",
            boards: [],
        };
    }

    static getDerivedStateFromProps(props, state) {
        return { id: props.id };
    }
    
    componentDidUpdate() {
        const ref = firebase.firestore().collection('News/' + this.state.id + '/Comments')
        ref.onSnapshot((querySnapshot) => {
            const board = []
            querySnapshot.forEach((docs) => {
                board.push({
                    Comment: docs.data().Comment,
                    userName: docs.data().userName
                })
            })
            this.setState({
                boards: board
            })
        })
    }
    addComment(text) {
        const val = {
            Comment: text,
            userName: 'Test'
        }
        console.log(this.state.id)
        firebase.firestore().collection('News/' + this.state.id + '/Comments').add(val)
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
    }

    render() {
        return (
            <Col>
                <InputGroup>
                    <FormControl placeholder="Add Comment" value={this.state.comment} onChange={e => this.setState({comment: e.target.value})} />
                </InputGroup>
                <Button on onClick={this.addComment(this.state.comment)}>Submit</Button>
                {this.state.comment}
                    {this.state.boards.map((board) => (
                            <Card.Body>
                                <Card.Title>{board.Comment}</Card.Title>
                                <Card.Text>{board.userName}</Card.Text>
                            </Card.Body>
                    ))}
            </Col>
        );
    }
}

export default Comment;
