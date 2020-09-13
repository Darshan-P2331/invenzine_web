import React, { Component } from "react";
import { Col, Button, Form } from "react-bootstrap";

class Comment extends Component {
    constructor(props) {
        super(props);

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

    componentDidMount() {}

    componentDidUpdate() {}

    addComment() {}

    render() {
        return (
            <Col>
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
                </Form>
            </Col>
        );
    }
}

export default Comment;
