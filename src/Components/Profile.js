import React, { Component } from "react";
import firebase, { firestore, storage } from "../firebase";
import { Container, Card, Button, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Footer from "./Footer";

const ImgUpload = ({ onChange, src }) => (
  <label htmlFor="photo-upload" className="custom-file-upload fas">
    <div className="img-wrap img-upload">
      <img for="photo-upload" alt="#" src={src} />
    </div>
    <input id="photo-upload" type="file" onChange={onChange} />
  </label>
);

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details : {},
      isLogedIn: false,
      verified: false,
      file: "",
      admin: false,
    };
    this.resetPassword = this.resetPassword.bind(this);
    this.verification = this.verification.bind(this);
  }


  async getInfo() {
    const adminData = await firestore.collection("LocalAdmins").doc(this.state.email);
    adminData.get().then((details) => {
      if (details.exists) {
              this.setState({
                details: details.data(),
                admin: details.data().ApprovalStatus,
              });
      }
    });
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          name: user.displayName,
          email: user.email,
          isLogedIn: true,
          verified: user.emailVerified,
        });
        this.getInfo()
      }
    });
  }

  photoUpload = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
    const uploadTask = storage.ref(`/NewsImages/${file.name}`).put(file);
    uploadTask.on(
      "state_changed",
      (snapShot) => {},
      (err) => console.log(err),
      () => {
        storage
          .ref("NewsImages")
          .child(file.name)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            firestore.collection("LocalAdmins").doc(this.state.email).update({
              imgurl: fireBaseUrl,
            });
            this.setState({
              photoURL: fireBaseUrl,
            });
          });
      }
    );
  };

  resetPassword(email) {
    if (email !== null) {
      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => alert("Check your Email"));
    }
  }
  verification() {
    firebase.auth().currentUser.sendEmailVerification();
  }

  logout() {
    firebase.auth().signOut();
  }
  render() {
    return this.state.isLogedIn === true ? (
      <div>
        <NavBar />
        <div
          className="profile"
          style={{ backgroundColor: "rgb(255,255,244)" }}
        >
          <Container>
            <div className="d-flex justify-content-center">
              <div className="d-flex flex-column">
                <Card
                  className="profile-card py-3"
                  style={{ marginTop: "50%" }}
                >
                  {this.state.admin ? (
                    <ImgUpload
                      onChange={this.photoUpload}
                      src={this.state.details.imgurl || "/profile.jpg"}
                    />
                  ) : (
                    <div className="custom-file-upload">
                    <div className="img-wrap">
                    <Image src={this.state.details.imgurl || "/profile.jpg"} />
                    </div>
                    </div>
                  )}

                  <Card.Title className="username">
                    {this.state.name}
                  </Card.Title>
                  <Card.Text className="email">
                    {this.state.email ? this.state.email : ""}
                    {this.state.verified ? (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        color="green"
                        title="verified"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        color="red"
                        title="not verified"
                      />
                    )}
                  </Card.Text>
                  {!this.state.verified ? (
                    <Link onClick={this.verification}>
                      Send verification link
                    </Link>
                  ) : (
                    ""
                  )}
                  {this.state.email ? (
                    <Link onClick={(e) => this.resetPassword(this.state.email)}>
                      Reset Password ?
                    </Link>
                  ) : (
                    ""
                  )}
                  <Button
                    className="btn btn-danger logout"
                    onClick={this.logout}
                    href="/profile"
                  >
                    Log Out
                  </Button>
                </Card>
              </div>
            </div>
          </Container>
        </div>
      </div>
    ) : (
      <div>
        <video autoPlay muted loop>
          <source src="circuit.mp4" type="video/mp4" />
        </video>
        <NavBar />
        <Container>
          <div className="text-white">
            <div className="d-flex justify-content-center">
              <div
                className="text-center"
                style={{ marginTop: "40vh", marginBottom: "30vh" }}
              >
                <h3>Please Sign In to View your Profile</h3>
                <Button className="btn btn-success" href="/signin">
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }
}

export default Profile;
