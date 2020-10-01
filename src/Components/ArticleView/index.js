import React from "react";
import firebase from "../../firebase";
import Comment from "../Comments";
import { Container, Col, Row, Image } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown, faCalendar } from '@fortawesome/free-solid-svg-icons'
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "../NavBar";

class ArticleView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: {},
            key: "",
            liked: false,
            disliked: false,
            like: [],
            dislike: [],
            totallike: 0,
            totaldislike: 0
        };
        this.like = this.like.bind(this)
        this.dislike = this.dislike.bind(this)
        this.ref = firebase.firestore().collection('News').doc(this.props.match.params.id)
    }

    componentDidMount() {
        
        this.ref.get().then((doc) => {
            if (doc.exists) {
                const { imgUrl, title, desc } = doc.data()
                this.setState({
                    board: {
                        imgUrl,
                        title,
                        desc
                    },
                    like: doc.data().like,
                    dislike: doc.data().dislike,
                    key: doc.id,
                    
                });
                
            } else {
                console.log("No such document exists");
            }
            this.setState({
                liked: firebase.auth().currentUser !== null ? this.state.like.includes(firebase.auth().currentUser.uid) : false,
                disliked: firebase.auth().currentUser !== null ? this.state.dislike.includes(firebase.auth().currentUser.uid) : false,
                totallike: this.state.like.length,
                totaldislike: this.state.dislike.length
            })
        });
    }



    like() {
        const uid = firebase.auth().currentUser.uid
        if (this.state.disliked) {
            this.ref.update({
                dislike: firebase.firestore.FieldValue.arrayRemove(uid),
                like: firebase.firestore.FieldValue.arrayUnion(uid)
            }).then(() => 
                this.setState({
                    disliked: false,
                    liked: true,
                    totaldislike: this.state.totaldislike - 1,
                    totallike: this.state.totallike + 1,
                })
            )
        }else 
        if (this.state.liked) {
            this.ref.update({
                like: firebase.firestore.FieldValue.arrayRemove(uid)
            }).then(() =>
                this.setState({
                    liked: false,
                    totallike: this.state.totallike - 1
                })
            )
        }else {
            this.ref.update({
                like: firebase.firestore.FieldValue.arrayUnion(uid)
            }).then(() =>
                this.setState({
                    liked: true,
                    totallike: this.state.totallike + 1
                })
            )
        }
        
    }

    dislike() {
        const uid = firebase.auth().currentUser.uid
        if (this.state.liked) {
            this.ref.update({
                dislike: firebase.firestore.FieldValue.arrayUnion(uid),
                like: firebase.firestore.FieldValue.arrayRemove(uid)
            }).then(() => {
                this.setState({
                    liked: false,
                    totallike: this.state.totallike - 1,
                    disliked: true,
                    totaldislike: this.state.totaldislike + 1,
                })
            })
        } else
        if (this.state.disliked) {
            this.ref.update({
                dislike: firebase.firestore.FieldValue.arrayRemove(uid)
            }).then(() => {
                this.setState({
                    disliked: false,
                    totaldislike: this.state.totaldislike - 1
                })
            })
        } else {
            this.ref.update({
                dislike: firebase.firestore.FieldValue.arrayUnion(uid)
            }).then(() => {
                this.setState({
                    disliked: true,
                    totaldislike: this.state.totaldislike + 1
                })
            })
        }
    }

    render() {
        return (
            <div>
                <NavBar />
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
                        <h6 className="text-secondary"><FontAwesomeIcon icon={faCalendar} size="lg" /> {this.state.board.category}</h6>
                        <br/>
                        <FontAwesomeIcon icon={faThumbsUp} size="lg" onClick={firebase.auth().currentUser !== null ? this.like : ''} style={this.state.liked ? { color: '#007bff' } : {}} className="fa-lg" /> {this.state.totallike}
                        <FontAwesomeIcon icon={faThumbsDown} size="lg" onClick={firebase.auth().currentUser !== null ? this.dislike : ''} style={this.state.disliked ? { color: '#007bff' } : {}} className="ml-3" /> {this.state.totaldislike}
                    </Col>
                </Row>
                <Row className="my-5">{this.state.board.desc}</Row>
                <Comment id={this.state.key} />
            </Container>
            </div>
        );
    }
}

export default ArticleView;
