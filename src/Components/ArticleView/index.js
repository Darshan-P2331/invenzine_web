import React from "react";
import firebase from "../../firebase";
import Comment from "../Comments";
import { Container, Col, Row, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

class ArticleView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: {},
            key: "",
        };
    }

    async componentDidMount() {
        const ref = firebase
            .firestore()
            .collection("News")
            .doc(this.props.match.params.id);
        ref.get().then((doc) => {
            if (doc.exists) {
                this.setState({
                    board: doc.data(),
                    key: doc.id,
                });
            } else {
                console.log("No such document exists");
            }
        });
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col md={6}>
                        <Image
                            fluid
                            src={this.state.board.imgUrl}
                            style={{
                                height: "320px",
                            }}
                        />
                    </Col>
                    <Col md={6} className="mt-5">
                        <h1>{this.state.board.title}</h1>
                    </Col>
                </Row>
                <Row className="my-5">{this.state.board.desc}</Row>
                <Comment id={this.state.key} />
            </Container>
        );
    }
}

export default ArticleView;
