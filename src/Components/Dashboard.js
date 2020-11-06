import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Container, Row, Col, Card, NavDropdown } from "react-bootstrap";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import firebase, { firestore, storage } from '../firebase'
import './style.css'
import { Link } from 'react-router-dom'

export class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            boards: [],
            admin: ''
        }
        this.delete = this.delete.bind(this)
    }

    componentDidMount() {
        console.log(this.props.super);
        firebase.auth().onAuthStateChanged((user) => {
            if (this.props.super) {
                firestore.collection('News').onSnapshot((querySnapshot) => {
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
                })
            } else {
                firestore.collection('News').where("adminname", "==", user.displayName).onSnapshot((querySnapshot) => {
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
                })
            }
        })
    }

    delete(id, imgname) {
        storage.ref('/NewsImages/' + imgname).delete().then(function () {
            firestore.collection('News').doc(id).delete().then(() => {
                console.log('Delete successful')
            })
        })
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
                                                <Link to={'/admin/edit/' + board.key}><NavDropdown.Item href="#action/3.2" className='text-warning'><FontAwesomeIcon icon={faEdit} />&nbsp;Edit</NavDropdown.Item></Link>
                                                <Link to={'/articleview/' + board.key} ><NavDropdown.Item href="#action/3.3" className='text-white'>View Comment</NavDropdown.Item></Link>
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

export default Dashboard
