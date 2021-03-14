import React, { Component } from "react";
import { firestore } from "../firebase";
import { Container, Card, Button, CardColumns } from "react-bootstrap";
import NavBar from "./NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import 'bootstrap/dist/css/bootstrap.min.css'
import Banner from "./Banner";
import { Link } from "react-router-dom";

class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            boards: [],
            lastViewed: null,
            totalPost: 0
        }
        this.handleclick = this.handleclick.bind(this)
    }

    async getData() {
        const posts = await firestore.collection('News').orderBy("date", "desc").limit(9)
        posts.onSnapshot(querySnapshot => {
            this.setState({
                lastViewed: querySnapshot.docs[querySnapshot.docs.length - 1]
            })
            const boards = []
            querySnapshot.forEach((docs) => {
                const { title, imgUrl, adminname, desc } = docs.data();
                boards.push({
                    key: docs.id,
                    title,
                    imgUrl,
                    adminname,
                    desc
                });
            });
            this.setState({
                boards,
            });
        })
    }

    async getDataLater(lastViewed) {
        const posts = await firestore.collection('News').orderBy("date", "desc").startAfter(lastViewed).limit(9)
        posts.onSnapshot(querySnapshot => {
            this.setState({
                lastViewed: querySnapshot.docs[querySnapshot.docs.length - 1]
            })
            const boards = []
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
                boards: this.state.boards.concat(boards)
            });
        })
    }
    handleclick() {
        this.getDataLater(this.state.lastViewed)
    }

    componentDidMount() {
        firestore.collection('News').onSnapshot(querysnapshot => {
            this.setState({
                totalPost: querysnapshot.docs.length
            })
        })
        this.getData()
    }

    render() {
        return (
            <div>
                <header>
                    <NavBar />
                </header>
            <main>
                <Banner />
                <div style={{ backgroundColor: '#fff', margin: '0', width: '100%' }}>
                    <Container>
                        <div className='latest-post text-center mb-0'>
                            <div className='section-heading text-left'>
                                <h5 className='heading'>Latest Post</h5>
                            </div>
                            <CardColumns>
                                {
                                    this.state.boards.map(board => (
                                        <Card href={'/article' + board.key} className='main-card'>
                                            <Link to={'/articleview/'+ board.key} style={{textDecoration: 'none', color: '#000'}}>
                                            <Card.Img href={'/articleview/'+board.key} src={board.imgUrl} />
                                            <Card.Body className='text-left'>
                                                <Card.Title>{board.title} </Card.Title>
                                                <footer className="blockquote-footer text-right">
                                                    <small className="text-muted">
                                                        By <cite title="Source Title">{board.adminname} </cite>
                                                    </small>
                                                </footer>
                                                <Card.Text className='desc'>
                                                    {board.desc}
                                                </Card.Text>
                                            </Card.Body>
                                            </Link>
                                        </Card>
                                    ))
                                }
                            </CardColumns>
                            {
                                this.state.boards.length < this.state.totalPost ?
                                    <Button variant="light" onClick={this.handleclick}>Load more <FontAwesomeIcon icon={faChevronDown} /></Button>
                                    :
                                    ''
                            }
                        </div>
                    </Container>
                </div>
            </main>
            </div>
        )
    }
}

export default Home