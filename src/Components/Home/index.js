import React from "react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import { Container, Col, Row, Card } from "react-bootstrap";
import NavBar from "../NavBar";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection("News");
        this.unsubscribe = null;
        this.state = {
            boards: [],
        };
    }

    onCollectionUpdate = (querySnapshot) => {
        const boards = [];
        querySnapshot.forEach((docs) => {
            const { title, desc, imgUrl } = docs.data();
            boards.push({
                key: docs.id,
                docs,
                title,
                desc: desc.slice(0, 35),
                imgUrl,
            });
        });
        this.setState({
            boards,
        });
    };

    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    }

    render() {
        return (
            <div>
                <NavBar />
            <Container>
                <Row>
                    {this.state.boards.map((board) => (
                        <Col key={board.key} lg={4} md={6}>
                            <Link
                                to={`/articleview/${board.key}`}
                                style={{ textDecoration: "none" }}
                            >
                                <Card className="mb-5">
                                    <Card.Img
                                        src={board.imgUrl}
                                        style={{ height: "212px" }}
                                    />
                                    <Card.Body>
                                        <Card.Title style={{ color: "#000" }}>
                                            {board.title}
                                        </Card.Title>
                                        <Card.Text style={{ color: "#6c757d" }}>
                                            {board.desc}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Container>
            </div>
        );
    }

    logout() {
        firebase.auth().signOut();
    }
}

export default Home;
