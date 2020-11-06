import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Container, Row, Col, Card, NavDropdown } from "react-bootstrap";
import { faTrash, faCheck } from "@fortawesome/free-solid-svg-icons";
import firebase, { firestore, storage } from '../firebase'
import './style.css'

export class Draft extends Component {

    constructor() {
        super()
        this.state = {
            boards: []
        }
        this.delete = this.delete.bind(this)
        this.post = this.post.bind(this)
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            firestore.collection('DraftNews').where("adminname", "==", user.displayName).onSnapshot((querySnapshot) => {
                const boards = []
                querySnapshot.forEach((docs) => {
                    const { title, likes, imgUrl, ImageFileName } = docs.data()
                    boards.push({
                        key: docs.id,
                        title,
                        likes,
                        imgUrl,
                        ImageFileName
                    })
                });
                this.setState({
                    boards
                })
                console.log(this.state.boards);
            })
        })

    }

    post(id){
        firestore.collection('DraftNews').doc(id).get().then((doc) => {
            if (doc.exists) {
                firestore.collection('News').add(doc.data()).then(this.delete(id))
            }
        })
    }

    delete(id, imgname) {
        if (imgname) {
            storage.ref('/NewsImages/' + imgname).delete().then(function () {
                firestore.collection('DraftNews').doc(id).delete().then(() => {
                    console.log('Delete successful')
                })
            })
        } else {
            firestore.collection('DraftNews').doc(id).delete().then(() => {
                console.log('Delete successful')
            })
        }
    }

    render() {
        return (
            <Container className='pt-3'>
                {this.state.boards.length > 0 ?
                    <Row>
                        {this.state.boards.map((board) => (
                            <Col lg={4} md={6} className='p-0'>
                                <Card className='text-white mb-5' >
                                    <Card.Img src={board.imgUrl} />
                                    <Card.ImgOverlay style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                                        <Card.Title>
                                            {board.title}
                                        </Card.Title>
                                        <Card.Subtitle>
                                            {board.likes}
                                        </Card.Subtitle>
                                        <div style={{ marginLeft: '15.8rem', marginTop: '4.8rem' }}>
                                            <NavDropdown title='' id="basic-nav-dropdown">
                                                <NavDropdown.Item href="#action/3.1" className='text-danger' onClick={e => this.delete(board.key, board.ImageFileName)}><FontAwesomeIcon icon={faTrash} />&nbsp;Delete</NavDropdown.Item>
                                                <NavDropdown.Item href="#action/3.2" className='text-success' onClick={e => this.post(board.key)}><FontAwesomeIcon icon={faCheck} />&nbsp;Post</NavDropdown.Item>
                                            </NavDropdown>
                                        </div>
                                    </Card.ImgOverlay>
                                </Card>
                            </Col>
                        ))}

                    </Row> :
                    <div className='d-flex justify-content-center'>
                        <div className='d-flex flex-column'>
                            <h1 className='text-secondary' style={{ marginTop: '250%' }}>Empty</h1>
                        </div>
                    </div>
                }
            </Container>
        )
    }
}

export default Draft
