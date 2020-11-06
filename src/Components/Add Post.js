import { faCheck, faFile, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'
import Autosuggest from 'react-autosuggest'
import { Button, Container, Form, Image, ProgressBar, InputGroup } from 'react-bootstrap'
import firebase, { firestore, storage } from '../firebase'

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

class AddPost extends Component {
    constructor() {
        super()
        this.state = {
            file: null,
            title: '',
            desc: '',
            url: '',
            progress: 0,
            tags: [],
            value: '',
            suggestions: []
        }
        this.handleChange = this.handleChange.bind(this)
        this.submitPost = this.submitPost.bind(this)
        this.draftPost = this.draftPost.bind(this)
        this.removeTag = this.removeTag.bind(this)
        this.addTag = this.addTag.bind(this)
    }

    //Autosuggest for Tags
    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        })
    }

    //Autosuggest
    onSuggestionsFetchRequired = ({ value }) => {
        this.setState({
            suggestions: getSuggestion(value)
        })
    }

    //Autosuggest
    onSuggestionsClearRequired = () => {
        this.setState({
            suggestion: []
        })
    }

    //Store Data 
    handleChange(value, name) {
        this.setState({ [name]: value })
    }

    //Post to News Collection
    submitPost() {
        if (!this.state.file) {
            alert('Choose a image')
        } else {
            const uploadTask = storage.ref(`/NewsImages/${this.state.file.name}`).put(this.state.file)
            uploadTask.on('state_changed',
                (snapShot) => {
                    //takes a snap shot of the process as it is happening
                    this.setState({
                        progress: Math.round((snapShot.bytesTransferred / snapShot.totalBytes) * 100)
                    })

                }, (err) => {
                    //catches the errors
                    console.log(err)
                }, () => {
                    // gets the functions from storage refences the image storage in firebase by the children
                    // gets the download url then sets the image from firebase as the value for the imgUrl key:
                    storage.ref('NewsImages').child(this.state.file.name).getDownloadURL()
                        .then(fireBaseUrl => {
                            this.setState({ url: fireBaseUrl })
                            firestore.collection('News').add({
                                title: this.state.title,
                                desc: this.state.desc,
                                imgUrl: fireBaseUrl,
                                adminname: firebase.auth().currentUser.displayName,
                                ImageFileName: this.state.file.name,
                                likes: 0,
                                dislikes: 0,
                                tags: this.state.tags,
                                like: [],
                                dislike: [],
                                date: Date().slice(4,15)
                            }).then(() => alert('Completed'))
                        })
                })
        }
    }


    //Save Post as draft
    draftPost() {
        if (!this.state.file) {
            alert('Choose a image')
        } else {
            const uploadTask = storage.ref(`/NewsImages/${this.state.file.name}`).put(this.state.file)
            uploadTask.on('state_changed',
                (snapShot) => {
                    //takes a snap shot of the process as it is happening
                    this.setState({
                        progress: Math.round((snapShot.bytesTransferred / snapShot.totalBytes) * 100)
                    })

                }, (err) => {
                    //catches the errors
                    console.log(err)
                }, () => {
                    // gets the functions from storage refences the image storage in firebase by the children
                    // gets the download url then sets the image from firebase as the value for the imgUrl key:
                    storage.ref('NewsImages').child(this.state.file.name).getDownloadURL()
                        .then(fireBaseUrl => {
                            this.setState({ url: fireBaseUrl })
                            firestore.collection('DraftNews').add({
                                title: this.state.title,
                                desc: this.state.desc,
                                imgUrl: fireBaseUrl,
                                adminname: firebase.auth().currentUser.displayName,
                                ImageFileName: this.state.file.name,
                                likes: 0,
                                dislikes: 0
                            }).then(() => alert('Completed'))
                        })
                })
        }
    }

    //Reemove Tag
    removeTag(i) {
        var tags = this.state.tags
        tags.splice(i, 1)
        this.setState({
            tags
        })
        console.log(this.state.tags);
    }

    //Add New Tag
    addTag(target) {
        if (target.charCode === 13) {
            this.state.tags.push(this.state.value)
            console.log(this.state.tags);
            this.setState({
                value: ''
            })
        }
    }

    render() {
        const { value, suggestions } = this.state

        const inputProps = {
            placeholder: 'Search',
            value,
            onChange: this.onChange,
            onKeyPress: this.addTag
        }
        return (
            <Container>
                <Form className='float-center pt-5'>
                    <Image src={this.state.url || 'logo512.png'} alt='post-image' width='300' className='float-center' />
                    <Form.Group>
                        <Form.File id='img' label='Post Image' name='file' onChange={e => this.handleChange(e.target.files[0], 'file')} ></Form.File>
                    </Form.Group>
                    <Form.Group controlId='emailcontrol'>
                        <Form.Label>Title</Form.Label>
                        <Form.Control placeholder='Title' name='title' onChange={e => this.handleChange(e.target.value, 'title')} value={this.state.title} />
                    </Form.Group>
                    <Form.Group controlId='emailcontrol'>
                        <Form.Label>Category</Form.Label>
                        <InputGroup>
                            {this.state.tags.map((tag, index) =>
                                <div className='btn btn-primary mr-2' style={{ width: 'auto' }}>{tag} &nbsp;<FontAwesomeIcon onClick={e => this.removeTag(index)} icon={faWindowClose} /></div>
                            )}
                            <Autosuggest
                                suggestions={suggestions}
                                onSuggestionsClearRequested={this.onSuggestionsClearRequired}
                                onSuggestionsFetchRequested={this.onSuggestionsFetchRequired}
                                getSuggestionValue={getSuggestionValue}
                                renderSuggestion={renderSuggestion}
                                inputProps={inputProps}
                                theme={theme}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as='textarea' rows='4' name='desc' placeholder='Description' onChange={e => this.handleChange(e.target.value, 'desc')} />
                    </Form.Group>
                    <ProgressBar animated now={this.state.progress} label={`${this.state.progress}%`} />
                    <Button variant='outline-success' className='m-3' onClick={this.submitPost}><FontAwesomeIcon icon={faCheck} /> Post</Button>
                    <Button variant='outline-warning' className='m-3' onClick={this.draftPost}><FontAwesomeIcon icon={faFile} /> Draft</Button>
                </Form>
            </Container>
        )
    }
}

export default AddPost
