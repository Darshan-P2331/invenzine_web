import React, { Component } from 'react'
import Autosuggest from 'react-autosuggest'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom";
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import NavBar from './NavBar'
import { firestore } from '../firebase';
import Footer from './Footer';

const theme = {
    input: {
        lineHeight: '1.5',
        fontWeight: '400',
        width: '8rem',
        fontSize: '1rem',
        border: '1px solid #ced4da',
        padding: '.375rem .75rem',
        display: 'block',
        borderRadius: '.25rem',
        transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out'
    },
    inputFocused: {
        color: '#495057',
        backgroundColor: '#fff',
        bordrColor: '#80bdff',
        outline: '0',
        boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, .25)',
    },
    suggestionsList: {
        listStyle: 'none',
        zIndex: '10'
    },
    containerOpen: {
        zIndex: '10'
    },
    container: {
        zIndex: '10'
    }
}

const languages = []

firestore.collection('Tags').doc('newstag').get().then(doc => {
    if (doc.exists) {
        const tags = doc.data().tags
        tags.forEach(element => {
            languages.push({
                name: element
            })
        });
    }
})

const getSuggestion = value => {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length

    return inputLength === 0 ? [] : languages.filter(lang =>
        lang.name.toLowerCase().slice(0, inputLength) === inputValue
    )
}

const getSuggestionValue = suggestion => suggestion.name

const renderSuggestion = suggestion => (
    <div>
        {suggestion.name}
    </div>
)

export class Search extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value: '',
            suggestions: [],
            searched: false,
            boards: []
        }
        this.filterSearch = this.filterSearch.bind(this)
    }

    filterSearch(tag) {
        if (tag.length !== 0) {
            firestore.collection('News').where('tags', "array-contains", tag).limit(10).get().then(querysnapshot => {
                const boards = [];
                querysnapshot.forEach((docs) => {
                    const { title, desc, imgUrl } = docs.data();
                    boards.push({
                        key: docs.id,
                        docs,
                        title,
                        desc: desc.slice(0, 35),
                        imgUrl,
                    });
                });
                this.setState({
                    boards,
                    searched: true
                });
            })
        }
    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        })
    }

    onSuggestionsFetchRequired = ({ value }) => {
        this.setState({
            suggestions: getSuggestion(value)
        })
    }

    onSuggestionsClearRequired = () => {
        this.setState({
            suggestion: []
        })
    }

    render() {
        const { value, suggestions } = this.state

        const inputProps = {
            placeholder: 'Search',
            value,
            onChange: this.onChange
        }
        return (
            <div>
                <NavBar />
                <Container>
                    <Row className='mt-5 h-100'>
                        <Col md={6} lg={4}>
                            <div style={{ display: 'inline-flex' }}>
                                <Autosuggest
                                    suggestions={suggestions}
                                    onSuggestionsClearRequested={this.onSuggestionsClearRequired}
                                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequired}
                                    getSuggestionValue={getSuggestionValue}
                                    renderSuggestion={renderSuggestion}
                                    inputProps={inputProps}
                                    theme={theme}
                                />
                                <Button variant='outline-info' onClick={e => this.filterSearch(this.state.value)} style={{ width: '4rem', marginRight: '.5rem', height: '38px' }}><FontAwesomeIcon icon={faSearch} /></Button>
                            </div>
                        </Col>
                        <Col md={6} lg={8} className='pr-0'>
                            {this.state.searched && this.state.boards.length !== 0 ?
                                <Row>
                                    {this.state.boards.map((board) => (
                                        <Col lg={6}>
                                            <Link
                                                to={`/articleview/${board.key}`}
                                                style={{ textDecoration: "none" }}
                                            >
                                                <Card className="mb-5">
                                                    <Card.Img
                                                        src={board.imgUrl}
                                                        style={{ height: "212px" }}
                                                    />
                                                    <Card.Body>
                                                        <Card.Title style={{ color: "#000" }}>
                                                            {board.title}
                                                        </Card.Title>
                                                        <Card.Text style={{ color: "#6c757d" }}>
                                                            {board.desc}
                                                        </Card.Text>
                                                    </Card.Body>
                                                </Card>
                                            </Link>
                                        </Col>
                                    ))}
                                </Row>
                                :
                                <div className='d-flex justify-content-center'>
                                    <div className='d-flex flex-column'>
                                        <h1 className='text-secondary' style={{ marginTop: '250%',marginBottom: '250%' }}>Empty</h1>
                                    </div>
                                </div>
                            }
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Search
