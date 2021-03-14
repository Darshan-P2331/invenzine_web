import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import {
  Button,
  Card,
  CardColumns,
  Col,
  Container,
  Image,
  Row,
} from "react-bootstrap";
import { Link } from "react-router-dom";
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
    this.ref = firestore.collection("LocalAdmins").doc(this.email);
    this.handleclick = this.handleclick.bind(this)
    this.Subscribe = this.Subscribe.bind(this)
  }

  async getInfo() {
    const adminData = await firestore.collection("LocalAdmins").doc(this.email);
    adminData.get().then((details) => {
      this.setState({
        details: details.data(),
        totalfollowers: details.data().Subscribers.length,
        subscribed: firebase.auth().currentUser !== null
        ? details.data().Subscribers.includes(firebase.auth().currentUser.email)
        : false,
      });
      this.getPosts(this.email);
      console.log(this.state.subscribed);
    });
  }

  async getPosts(adminname) {
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
        boards.push({
          key: docs.id,
          title,
          imgUrl,
          adminname,
          desc,
        });
      });
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

  Subscribe() {
    const uemail = firebase.auth().currentUser.email;
    console.log(this.state.subscribed);
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
          Subscribers: firebase.firestore.FieldValue.arrayUnion(uemail),
        })
        .then(() =>
          this.setState({
            subscribed: true,
            totalfollowers: this.state.totalfollowers + 1,
          })
        );
    }
    console.log("Success");
  }

  componentDidMount() {
    firestore.collection('News').where("aemail","==",this.email).onSnapshot(querysnapshot => {
      this.setState({
          totalPost: querysnapshot.docs.length
      })
  })
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
              <div className="custom-file-upload">
                    <div className="img-wrap">
                    <Image src={ this.state.details.imgurl || "/profile.jpg"} />
                    </div>
                    </div>
                <Card.Title>{this.state.details.Username}</Card.Title>
                <Card.Text>{this.state.totalPost} Posts</Card.Text>
                <br/>
                <p className='text-muted'>{this.state.totalfollowers} Followers</p>
                <Button variant={this.state.subscribed? "secondary" : "primary"} onClick={this.Subscribe}>{this.state.subscribed? "UnSubscribe" : "Subscribe"}</Button>
              </div>
            </Col>
            <Col lg={8}>
              <Row className="px-3">
                <CardColumns className="py-5">
                  {this.state.boards.map((board) => (
                    <Card style={{width: "320px"}}>
                      <Link to={'/articleview/'+ board.key} style={{textDecoration: 'none', color: '#000'}}>
                      <Card.Img src={board.imgUrl} style={{width: "318px",objectFit: "cover"}} />
                      <Card.Body>
                        <Card.Title>{board.title}</Card.Title>
                      </Card.Body>
                      </Link>
                    </Card>
                  ))}
                </CardColumns>
                {this.state.boards.length < this.state.totalPost ? (
                  <Button variant="light" onClick={this.handleclick}>
                    Load more <FontAwesomeIcon icon={faChevronDown} />
                  </Button>
                ) : (
                  ""
                )}
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
