import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { faTrash, faEdit, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import firebase, { firestore, storage } from '../firebase'
import './style.css'

export class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            boards: [],
            lastViewed: null,
            totalPost: 0,
            admin: ''
        }
        this.delete = this.delete.bind(this)
        this.handleclick = this.handleclick.bind(this)
    }

    async getData(user) {
        var posts
        if (this.props.super) {
            posts = await firestore.collection('News').where('adminname','==',this.props.match.params.id).orderBy("date", "asc").limit(9)
        }else{
             posts = await firestore.collection('News').where('adminname','==',user).orderBy("date", "asc").limit(9)
        }
        posts.onSnapshot(querySnapshot => {
            this.setState({
                lastViewed: querySnapshot.docs[querySnapshot.docs.length - 1]
            })
            const boards = []
            querySnapshot.forEach((docs) => {
                const { title, imgUrl, adminname, ImageFileName } = docs.data();
                boards.push({
                    key: docs.id,
                    title,
                    imgUrl,
                    adminname,
                    ImageFileName
                });
            });
            this.setState({
                boards,
            });
        })
    }

    async getDataLater(lastViewed, user) {
        const posts = await firestore.collection('News').where('adminname','==',user).orderBy("date", "asc").startAfter(lastViewed).limit(9)
        posts.onSnapshot(querySnapshot => {
            this.setState({
                lastViewed: querySnapshot.docs[querySnapshot.docs.length - 1]
            })
            const boards = []
            querySnapshot.forEach((docs) => {
                const { title, imgUrl, adminname, desc, ImageFileName } = docs.data();
                boards.push({
                    key: docs.id,
                    title,
                    imgUrl,
                    desc,
                    adminname,
                    ImageFileName
                });
            });
            this.setState({
                boards: this.state.boards.concat(boards)
            });
        })
    }

    handleclick() {
        this.getDataLater(this.state.lastViewed,this.state.admin)
    }

    componentDidMount() {
        console.log(this.props.super);
        firebase.auth().onAuthStateChanged((user) => {
            if (this.props.super) {
                firestore.collection('News').where('adminname','==',this.props.match.params.id).onSnapshot(querysnapshot => {
                    this.setState({
                        totalPost: querysnapshot.docs.length
                    })
                })
            } else {
                firestore.collection('News').where('adminname','==',user.displayName).onSnapshot(querysnapshot => {
                    this.setState({
                        totalPost: querysnapshot.docs.length,
                        admin: user.displayName
                    })
                })
            }
            this.getData(user.displayName)
        })
    }

    delete(id, imgname) {
        storage.ref('/NewsImages/' + imgname).delete().then(function () {
            firestore.collection('News').doc(id).delete().then(() => {
                console.log('Delete successful')
                alert('Deleted successfully')
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
                                <Card className='mb-5' style={{width: '300px'}}>
                                    <Card.Img src={board.imgUrl}/>
                                    <Card.Body>
                                        <Card.Title>{board.title}</Card.Title>
                                    </Card.Body>
                                    <Card.Footer style={{justifyContent: 'space-between'}}>
                                        <Button style={{borderRadius: '50%',padding: '10px 0', width: '50px',marginRight: '2em'}} variant='danger' onClick={e => this.delete(board.key, board.ImageFileName)}><FontAwesomeIcon icon={faTrash}/> </Button>
                                        <Button style={{borderRadius: '50%',padding: '10px 0', width: '50px'}} variant='warning' href={'/admin/edit/' + board.key}><FontAwesomeIcon icon={faEdit} /> </Button>
                                        <Button style={{borderRadius: '50%',padding: '10px 0', width: '50px',marginLeft: '2em'}} variant='outline-primary' href={'/articleview/' + board.key}><FontAwesomeIcon icon={faEdit} /> </Button>
                                    </Card.Footer>
                                </Card>                                
                            </Col>
                        ))}
                        {
                                this.state.boards.length < this.state.totalPost ?
                                    <Button variant="light" onClick={this.handleclick}>Load more <FontAwesomeIcon icon={faChevronDown} /></Button>
                                    :
                                    ''
                            }

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
