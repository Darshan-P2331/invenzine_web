import React, { Component } from 'react'
import { Card, Col, InputGroup, FormControl, Container, Button } from 'react-bootstrap'
import firebase, { firestore } from '../firebase'

class AddCategory extends Component {
    constructor() {
        super()

        this.state = {
            boards: [],
            tag: ''
        }
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.removeTag = this.removeTag.bind(this)
    }

    componentDidMount() {
        firestore.collection('Tags').doc('newstag').get().then(doc => {
            if (doc.exists) {
                this.setState({
                    boards: doc.data().tags
                })
            }
        })
    }

    handleKeyPress(target) {
        if (target.charCode === 13) {
            firestore.collection('Tags').doc('newstag').update({
                tags: firebase.firestore.FieldValue.arrayUnion(this.state.tag)
            }).then(() => {
                alert('Added tag successfully')
                this.props.history.push("/admin/addcategory")
            })
            this.setState({
                tag: ''
            })
        }
    }

    removeTag(value){
        firestore.collection('Tags').doc('newstag').update({
            tags: firebase.firestore.FieldValue.arrayRemove(value)
        }).then(() => {
            alert('Removed tag')
            this.props.history.push("/admin/addcategory")
        })
    }

    render() {
        return (
            <Container>
            <Col>
                <InputGroup className='mt-5'>
                    <FormControl placeholder="Add Category" value={this.state.tag} onChange={e => this.setState({ tag: e.target.value })} onKeyPress={this.handleKeyPress} />
                </InputGroup>
                {this.state.boards.map((tag) => (
                    <div>
                    <div className='d-flex justify-content-between my-2'>
                        <Card.Title className='mt-2'>{tag}</Card.Title>
                        <Button variant='danger' onClick={e => this.removeTag(tag)}>Remove</Button>
                        
                    </div>
                    <hr />
                    </div>
                ))}
            </Col>
            </Container>
        )
    }
}

export default AddCategory
