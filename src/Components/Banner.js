import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../Style.css'
import { Card, Container, Row } from 'react-bootstrap'
import { firestore } from '../firebase'

class Banner extends Component {
    constructor(props) {
        super(props)

        this.state = {
            boards: []
        }
    }

    async getData() {
        const posts = await firestore.collection('News').orderBy("likes", "desc").limit(4)
        posts.onSnapshot(querySnapshot => {
            const boards = []
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
        })
    }

    componentDidMount() {
        this.getData()
    }

    render() {
        return (
            <div className='banner'>
                <video autoPlay muted loop>
                    <source 
                     src='circuit.mp4'
                     type='video/mp4' />
                </video>
                <Container className='pt-5 mb-5'>
                    <div className='title-section'>
                        <h1>INVEN<span style={{ color: 'yellow' }}>Z</span>INE</h1>
                        <h5>E Magazine</h5>
                    </div>
                        <div className='section-heading text-left'>
                            <h5 className='heading'>Popular Post</h5>
                        </div>
                    <Row className='d-flex flex-row flex-nowrap'>
                        {
                            this.state.boards.map(board => (
                                <div className='item'>
                                    <Card className='card-block bg-transparent mx-3' style={{ flex: '1' }}>
                                        <Card.Img src={board.imgUrl} alt='Post-1' />
                                        <Card.Body>
                                            <Card.Title>{board.adminname} </Card.Title>
                                            <footer className="blockquote-footer">
                                                <small className="text-white">
                                                    By <cite>{board.adminname} </cite>
                                                </small>
                                            </footer>
                                        </Card.Body>
                                    </Card>
                                </div>
                            ))
                        }
                    </Row>

                </Container>
            </div>
        )
    }
}

export default Banner
