import React, { Component } from "react";
import { Col, Card, InputGroup, FormControl } from "react-bootstrap";
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
        this.handleKeyPress = this.handleKeyPress.bind(this)
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

    handleKeyPress(target) {
        if (target.charCode === 13) {
            this.addComment()
        }
    }

    addComment() {
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
                    <InputGroup>
                        <FormControl placeholder="Add Comments" value={this.state.comment} onChange={e => this.setState({ comment: e.target.value })} onKeyPress={this.handleKeyPress} />
                    </InputGroup>
                    :
                    <InputGroup>
                        <FormControl disabled placeholder="Add Comments" value={this.state.comment} onChange={e => this.setState({ comment: e.target.value })} />
                    </InputGroup>
                }
                {this.state.boards.map((board) => (
                    <div>
                        <Card.Body>
                            <Card.Title>{board.Comment}</Card.Title>
                            <Card.Text>{board.userName}</Card.Text>
                        </Card.Body>
                        <hr />
                    </div>
                ))}
            </Col>
        );
    }
}

export default Comment;
