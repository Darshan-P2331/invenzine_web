import React from "react";
import firebase, { firestore } from "../firebase";
import { Container, Col, Row, Image, InputGroup, FormControl, Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown, faCalendar, faShare, faTrash, faUser } from '@fortawesome/free-solid-svg-icons'
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./NavBar";
import Share from "./Share";

class ArticleView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: {},
            comments: [],
            liked: false,
            disliked: false,
            like: [],
            dislike: [],
            totallike: 0,
            totaldislike: 0,
            shareview: false,
            superAdmin: false
        };
        this.like = this.like.bind(this)
        this.dislike = this.dislike.bind(this)
        this.addComment = this.addComment.bind(this)
        this._removeComment = this._removeComment.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.ref = firestore.collection('News').doc(this.props.match.params.id)
    }

    componentDidMount() {
        //Accessing Article
        this.ref.get().then((doc) => {
            if (doc.exists) {
                const { imgUrl, title, desc, adminname } = doc.data()
                this.setState({
                    board: {
                        imgUrl,
                        title,
                        desc,
                        
                        adminname
                    },
                    like: doc.data().like,
                    dislike: doc.data().dislike,
                    key: doc.id,
                    totallike: doc.data().likes ? doc.data().likes : 0,
                    totaldislike: doc.data().dislikes ? doc.data().dislikes : 0,
                });

            } else {
                console.log("No such document exists");
            }
            this.setState({
                liked: firebase.auth().currentUser !== null && this.state.like ? this.state.like.includes(firebase.auth().currentUser.uid) : false,
                disliked: firebase.auth().currentUser !== null && this.state.dislike ? this.state.dislike.includes(firebase.auth().currentUser.uid) : false,
            })
        });
        //Accessing Comments
        this.ref.collection('Comments').onSnapshot((querySnapshot) => {
            const board = []
            querySnapshot.forEach((docs) => {
                board.push({
                    Comment: docs.data().Comment,
                    userName: docs.data().userName,
                    key: docs.id
                })
            })
            this.setState({
                comments: board
            })
        })

        //Checking for Super Admin
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                firestore.collection('Super Admin').doc(user.email).get().then(info => {
                    if (info.exists) {
                        this.setState({
                            superAdmin: info.data().SuperAdmin ? info.data().SuperAdmin : false
                        })
                    }
                })
            }
        })
    }



    like() {
        const uid = firebase.auth().currentUser.uid
        if (this.state.disliked) {
            this.ref.update({
                dislike: firebase.firestore.FieldValue.arrayRemove(uid),
                like: firebase.firestore.FieldValue.arrayUnion(uid),
                likes: this.state.totallike + 1,
                dislikes: this.state.totaldislike -1
            }).then(() =>
                this.setState({
                    disliked: false,
                    liked: true,
                    totaldislike: this.state.totaldislike - 1,
                    totallike: this.state.totallike + 1,
                })
            )
        } else
            if (this.state.liked) {
                this.ref.update({
                    like: firebase.firestore.FieldValue.arrayRemove(uid),
                    likes: this.state.totallike -1
                }).then(() =>
                    this.setState({
                        liked: false,
                        totallike: this.state.totallike - 1
                    })
                )
            } else {
                this.ref.update({
                    like: firebase.firestore.FieldValue.arrayUnion(uid),
                    likes: this.state.totallike+1
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
                like: firebase.firestore.FieldValue.arrayRemove(uid),
                likes: this.state.totallike - 1,
                dislikes: this.state.totaldislike + 1
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
                    dislike: firebase.firestore.FieldValue.arrayRemove(uid),
                    dislikes: this.state.totaldislike - 1
                }).then(() => {
                    this.setState({
                        disliked: false,
                        totaldislike: this.state.totaldislike - 1
                    })
                })
            } else {
                this.ref.update({
                    dislike: firebase.firestore.FieldValue.arrayUnion(uid),
                    dislikes: this.state.totaldislike + 1
                }).then(() => {
                    this.setState({
                        disliked: true,
                        totaldislike: this.state.totaldislike + 1
                    })
                })
            }
    }

    handleKeyPress(target) {
        if (target.charCode === 13) {
            this.addComment()
        }
    }

    addComment() {
        this.ref.collection('Comments').add({
            Comment: this.state.comment,
            userName: firebase.auth().currentUser.displayName
        }).then(function (docref) {
            console.log(docref.id)
        })
        this.setState({
            comment: ''
        })
    }

    _removeComment(id) {
        this.ref.collection('Comments').doc(id).delete()
    }

    render() {
        return (
            <div>
                <div className='bg-dark mb-5'>
                <NavBar />
                </div>
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
                            <h6 className="text-secondary"><FontAwesomeIcon icon={faCalendar} size="lg" /> {this.state.board.date}</h6>
                            <h6 className="text-secondary"><FontAwesomeIcon icon={faUser} size="lg" /> {this.state.board.adminname}</h6>
                            <br />
                            <FontAwesomeIcon icon={faThumbsUp} size="lg" onClick={firebase.auth().currentUser !== null ? this.like : ''} style={this.state.liked ? { color: '#007bff' } : {}} /> {this.state.totallike}
                            <FontAwesomeIcon icon={faThumbsDown} size="lg" onClick={firebase.auth().currentUser !== null ? this.dislike : ''} style={this.state.disliked ? { color: '#007bff' } : {}} className="ml-3" /> {this.state.totaldislike}
                            <br />
                            <br />
                            {firebase.auth().currentUser !== null ?
                            <FontAwesomeIcon icon={faShare} onClick={() => this.setState({shareview: true})} /> :
                            <div></div> 
                            }
                            
                        </Col>
                        <Share show={this.state.shareview} url={this.props.location.pathname} title={this.state.board.title} onHide={() => this.setState({ shareview: false })} />
                    </Row>
                    <Row className="my-5">{this.state.board.desc}</Row>
                    {
                        //Comments Section
                    }
                    <Col>
                        {firebase.auth().currentUser !== null ?
                            <InputGroup>
                                <FormControl placeholder="Add Comments" value={this.state.comment} onChange={e => this.setState({ comment: e.target.value })} onKeyPress={this.handleKeyPress} />
                            </InputGroup>
                            :
                            <InputGroup>
                                <FormControl disabled placeholder="Add Comments" value={this.state.comment} onChange={e => this.setState({ comment: e.target.value })} />
                            </InputGroup>
                        }
                        {this.state.comments.map((board) => (
                            <div>
                                <Card.Body>
                                    <Card.Title>{board.Comment}</Card.Title>
                                    <Card.Text>{board.userName}</Card.Text>
                                    {this.state.superAdmin ? <Button variant='danger' onClick={e => this._removeComment(board.key)} ><FontAwesomeIcon icon={faTrash} />Delete</Button> : <div />}
                                </Card.Body>
                                <hr />
                            </div>
                        ))}
                    </Col>
                </Container>
            </div>
        );
    }
}

export default ArticleView;
