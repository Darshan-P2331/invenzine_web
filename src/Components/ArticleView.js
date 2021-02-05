import React from "react";
import firebase, { firestore } from "../firebase";
import { Container, Col, Row, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./NavBar";
import Footer from "./Footer";
import PopularPosts from "./PopularPosts";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";

class ArticleView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: {
        desc: "",
      },
      comments: [],
      liked: false,
      like: [],
      totallike: 0,
      superAdmin: false,
      lastViewed: null
    };
    this.like = this.like.bind(this);
    this.addComment = this.addComment.bind(this);
    this._removeComment = this._removeComment.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.ref = firestore.collection("News").doc(this.props.match.params.id);
  }

  async getData() {
    const posts = await this.ref.collection("Comments").limit(9)
    posts.onSnapshot(querySnapshot => {
        this.setState({
            lastViewed: querySnapshot.docs[querySnapshot.docs.length - 1]
        })
        const board = [];
      querySnapshot.forEach((docs) => {
        board.push({
          Comment: docs.data().Comment,
          userName: docs.data().userName,
          key: docs.id,
        });
      });
      this.setState({
        comments: board,
      });
    })
}

  componentDidMount() {
    //Accessing Article
    this.ref.get().then((doc) => {
      if (doc.exists) {
        const { imgUrl, title, desc, adminname, date } = doc.data();
        this.setState({
          board: {
            imgUrl,
            title,
            desc,
            adminname,
            date: date.toDate().toDateString()
          },
          like: doc.data().like,
          key: doc.id,
          totallike: doc.data().likes ? doc.data().likes : 0,
        });
      } else {
        console.log("No such document exists");
      }
      this.setState({
        liked:
          firebase.auth().currentUser !== null && this.state.like
            ? this.state.like.includes(firebase.auth().currentUser.uid)
            : false,
      });
    });
    //Accessing Comments
    this.ref.collection("Comments").onSnapshot((querySnapshot) => {
      const board = [];
      querySnapshot.forEach((docs) => {
        board.push({
          Comment: docs.data().Comment,
          userName: docs.data().userName,
          key: docs.id,
        });
      });
      this.setState({
        comments: board,
      });
    });

    //Checking for Super Admin
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firestore
          .collection("Super Admin")
          .doc(user.email)
          .get()
          .then((info) => {
            if (info.exists) {
              this.setState({
                superAdmin: info.data().SuperAdmin
                  ? info.data().SuperAdmin
                  : false,
              });
            }
          });
      }
    });
  }

  like() {
    const uid = firebase.auth().currentUser.uid;
    if (this.state.liked) {
      this.ref
        .update({
          like: firebase.firestore.FieldValue.arrayRemove(uid),
          likes: this.state.totallike - 1,
        })
        .then(() =>
          this.setState({
            liked: false,
            totallike: this.state.totallike - 1,
          })
        );
    } else {
      this.ref
        .update({
          like: firebase.firestore.FieldValue.arrayUnion(uid),
          likes: this.state.totallike + 1,
        })
        .then(() =>
          this.setState({
            liked: true,
            totallike: this.state.totallike + 1,
          })
        );
    }
  }

  handleKeyPress(target) {
    if (target.charCode === 13) {
      this.addComment();
    }
  }

  addComment() {
    this.ref
      .collection("Comments")
      .add({
        Comment: this.state.comment,
        userName: firebase.auth().currentUser.displayName,
      })
      .then(function (docref) {
        console.log(docref.id);
      });
    this.setState({
      comment: "",
    });
  }

  _removeComment(id) {
    this.ref.collection("Comments").doc(id).delete();
  }

  render() {
    return (
      <div>
        <NavBar />
        <div className="bg-light article-page">
          <Container className="py-3">
            <Row>
              <Col md={12}>
                <Card className="article-card">
                  <Card.Img
                    className="article-img"
                    src={this.state.board.imgUrl}
                    alt="Article image"
                  />
                  <div class="text-right card-body">
                    <span class="like-button" onClick={this.like} style={this.state.liked ? {color: '#007BFF'} : {color: '#777777'}}>
                      <FontAwesomeIcon icon={faThumbsUp}/> &nbsp;
                      {this.state.totallike} Likes
                    </span>
                  </div>
                </Card>
              </Col>
              <Col lg={8}>
                <Card className="article-card" style={{ width: "auto" }}>
                  <Card.Body style={{ width: "auto" }}>
                    <div class="d-flex mx-3 my-3">
                      <span class="badge badge-pill badge-color mr-2">
                        tech
                      </span>
                    </div>
                    <h4 class="article-title">{this.state.board.title}</h4>
                    <span class="article-meta">
                      {this.state.board.date} / {this.state.board.adminname}
                    </span>
                    <div className="d-felx">
                      <EmailShareButton  subject={this.state.board.title} url={window.location.href}>
                        <EmailIcon round size={32} />
                      </EmailShareButton>&nbsp;
                      <FacebookShareButton quote={this.state.board.title} url={window.location.href}>
                        <FacebookIcon round size={32}/>
                      </FacebookShareButton>&nbsp;
                      <WhatsappShareButton title={this.state.board.title} url={window.location.href}>
                        <WhatsappIcon round size={32} />
                      </WhatsappShareButton>
                    </div>
                    {this.state.board.desc.split("\n").map((data) => (
                      <div class="article-detail">{data}</div>
                    ))}
                  </Card.Body>
                </Card>
                <div>
                  <Card
                    style={{
                      padding: "30px",
                      marginTop: "30px",
                      width: "auto",
                    }}
                  >
                    <div class="section-heading text-left">
                      <h5 class="heading">Leave a Comment</h5>
                    </div>
                    <div title="Login to add comment" class="input-group">
                      {firebase.auth().currentUser !== null ? (
                        <textarea
                          rows="5"
                          cols="30"
                          placeholder="Add Comments"
                          class="form-control"
                          value={this.state.comment}
                          onChange={(e) =>
                            this.setState({ comment: e.target.value })
                          }
                          onKeyPress={this.handleKeyPress}
                        ></textarea>
                      ) : (
                        <textarea
                          rows="5"
                          cols="30"
                          placeholder="Add Comments"
                          class="form-control"
                          disabled="true"
                        ></textarea>
                      )}
                    </div>
                  </Card>
                  <Card
                    style={{
                      padding: "30px",
                      marginTop: "30px",
                      width: "auto",
                    }}
                  >
                    <div class="section-heading text-left">
                      <h5 class="heading">Comments</h5>
                    </div>
                    <ol style={{ listStyle: "none", width: "100%" }}>
                      {this.state.comments.map((chat) => (
                        <li class="single-comment">
                          <div class="d-flex">
                            <div class="comment-author"></div>
                            <div class="comment-meta">
                              <h6>{chat.userName}</h6>
                              <p>{chat.Comment} </p>
                            </div>
                            <div></div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </Card>
                </div>
              </Col>
              <Col lg={4}>
                <PopularPosts />
              </Col>
            </Row>
          </Container>
        </div>
        <Footer />
      </div>
    );
  }
}

export default ArticleView;
