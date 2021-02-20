import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { Button, Card, CardColumns, Col, Container, Row } from "react-bootstrap";
import firebase, { firestore } from "../firebase";
import NavBar from "./NavBar";

export default class Author extends Component {
  constructor(props) {
    super(props);

    this.state = {
      details: {},
      boards: [],
      subscribed: false,
      totalfollowers: 0,
      lastViewed: null,
      totalPost: 0,
    };
    this.email = this.props.match.params.email;
    this.ref= firestore.collection("LocalAdmins").doc(this.email)
    this.handleclick = this.handleclick.bind(this);
  }

  async getInfo() {
    const adminData = await firestore.collection("LocalAdmins").doc(this.email);
    adminData.get().then((details) => {
      this.setState({
        details: details.data(),
        totalfollowers: details.data().Subscribers.length
      });
      this.getPosts(this.email)
    });
  }

  async getPosts(adminname) {
      console.log(adminname);
    const posts = await firestore
      .collection("News")
      .where("aemail", "==", adminname)
      .limit(9);
    posts.onSnapshot((querySnapshot) => {
      this.setState({
        lastViewed: querySnapshot.docs[querySnapshot.docs.length - 1],
      });
      const boards = [];
      querySnapshot.forEach((docs) => {
        const { title, imgUrl, adminname, desc } = docs.data();
        console.log(docs.data());
        boards.push({
          key: docs.id,
          title,
          imgUrl,
          adminname,
          desc,
        });
      });
      console.log(boards);
      this.setState({
        boards,
      });
    });
  }

  async getPostsLater(lastViewed, adminname) {
    const posts = await firestore
      .collection("News")
      .where("aemail", "==", adminname)
      .startAfter(lastViewed)
      .limit(9);
    posts.onSnapshot((querySnapshot) => {
      this.setState({
        lastViewed: querySnapshot.docs[querySnapshot.docs.length - 1],
      });
      const boards = [];
      querySnapshot.forEach((docs) => {
        const { title, imgUrl, adminname, desc } = docs.data();
        boards.push({
          key: docs.id,
          title,
          imgUrl,
          desc,
          adminname,
        });
      });
      this.setState({
        boards: this.state.boards.concat(boards),
      });
    });
  }

  handleclick() {
    this.getDataLater(this.state.lastViewed, this.state.adminname);
  }

  Subscribe(){
    const uemail = firebase.auth().currentUser.email;
    if (this.state.subscribed) {
      this.ref
        .update({
          Subscribers: firebase.firestore.FieldValue.arrayRemove(uemail),
        })
        .then(() =>
          this.setState({
            subscribed: false,
            totalfollowers: this.state.totalfollowers - 1,
          })
        );
    } else {
      this.ref
        .update({
          Subscribers: firebase.firestore.FieldValue.arrayUnion(uemail)
        })
        .then(() =>
          this.setState({
            subscribed: true,
            totalfollowers: this.state.totalfollowers + 1,
          })
        );
    }
  }

  componentDidMount() {
    this.getInfo();
  }

  render() {
    return (
      <div>
        <NavBar />
        <Container fluid>
          <Row>
            <Col lg={4}>
              <div className="justify-content-center pt-5 mt-4 flex-column text-center">
                <FontAwesomeIcon icon={faUserCircle} size="8x" color='yellow' />
                <Card.Title>{this.state.details.Username}</Card.Title>
                <Button>Subscribe</Button>
              </div>
            </Col>
            <Col lg={8}>
              
                <Row>
                  <CardColumns className='py-5'>
                  {this.state.boards.map((board) => (
                    <Card>
                      <Card.Img src={board.imgUrl} />
                      <Card.Body>
                        <Card.Title>{board.title}</Card.Title>
                      </Card.Body>
                    </Card>
                    ))}
                  </CardColumns>
                </Row>
              
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
