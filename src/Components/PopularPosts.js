import React, { Component } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { firestore } from "../firebase";

export default class PopularPosts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      boards: [],
    };
  }

  async getData() {
    const posts = await firestore.collection("News").orderBy("likes").limit(4);
    posts.onSnapshot((querySnapshot) => {
      const boards = [];
      querySnapshot.forEach((docs) => {
        const { title, imgUrl, adminname } = docs.data();
        boards.push({
          key: docs.id,
          title,
          imgUrl,
          adminname,
        });
      });
      this.setState({
        boards,
      });
    });
  }

  componentDidMount(){
    this.getData()
  }

  render() {
    return (
      <Row>
      <Col md={6}>
        <Card className="popular-post-card" style={{ padding: "30px" }}>
          <div>
            <div class="section-heading text-left">
              <h5 class="heading">Popular Posts</h5>
            </div>
            {this.state.boards.map((board) => (
              <div class="popular-post">
                <div class="post-thumbnail">
                  <img src={board.imgUrl} alt="popular-post" />
                </div>
                <a href={"/articleview/" + board.key} color='#000' class="popular-title">
                  {board.title}
                </a>
                <footer class="blockquote-footer">
                  <small class="text-grey">
                    By <cite>{board.adminname} </cite>
                  </small>
                </footer>
              </div>
            ))}
          </div>
        </Card>
      </Col>
      </Row>
    );
  }
}
