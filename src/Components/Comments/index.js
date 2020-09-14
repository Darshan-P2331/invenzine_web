import React, { Component } from "react";
import { Col, Button, Form } from "react-bootstrap";

class Comment extends Component {
    constructor(props) {
<<<<<<< HEAD
        super(props)
=======
        super(props);
>>>>>>> 54a32243bc99de73de319f408245838c1560692a

        this.state = {
            id: "",
            comment: "",
            board: {},
        };
        console.log(this.state.id);
    }

    static getDerivedStateFromProps(props, state) {
        return { id: props.id };
    }

<<<<<<< HEAD
    componentDidUpdate() {

    }

    addComment() {

    }
=======
    componentDidMount() {}

    componentDidUpdate() {}

    addComment() {}
>>>>>>> 54a32243bc99de73de319f408245838c1560692a

    render() {
        return (
            <Col>
<<<<<<< HEAD
                <Form onSubmit={this.addComment}>
                    <Form.Group>
                        <Form.Control type="text" value={this.state.comment} onChange={e => this.setState({ comment: e.target.value })} placeholder="Add Comment" />
                    </Form.Group>
                    <Button variant="outline-primary" type="submit">Submit</Button>
=======
                {this.state.id}
                <Form onSubmit={this.addComment}>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            value={this.state.comment}
                            onChange={(e) =>
                                this.setState({ comment: e.target.value })
                            }
                            placeholder="Add Comment"
                        />
                    </Form.Group>
                    <Button variant="outline-primary" type="submit">
                        Submit
                    </Button>
>>>>>>> 54a32243bc99de73de319f408245838c1560692a
                </Form>
            </Col>
        );
    }
}

export default Comment;
