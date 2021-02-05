import React, { Component } from 'react'
import { Container } from 'react-bootstrap'
import NavBar from './NavBar'

export default class AboutUs extends Component {
    render() {
        return (
            <div>
                <NavBar />
                <Container>
                    <div>
                        <div className='d-flex justify-content-center'>
                        <div class="text-center" style={{marginTop: "30vh", marginBottom: "30vh"}}>
                        <h2>About Us</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque voluptas deserunt beatae adipisci iusto totam placeat corrupti ipsum, tempora magnam incidunt aperiam tenetur a nobis, voluptate, numquam architecto fugit. Eligendi quidem ipsam ducimus minus magni illum similique veniam tempore unde?</p>
                        </div>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
}
