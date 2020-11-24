import { faFacebookF, faInstagram, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'
import { Col, Row } from 'react-bootstrap'
import '../Style.css'

class Footer extends Component {
    render() {
        return (
            <footer className="page-footer font-small text-white pt-4">


                <div className="container text-center text-md-left">


                    <div className="row">


                        <div className="col-md-3 mb-md-0 mb-3">
                            <h5 className='text-uppercase'>About Us</h5>
                            <p>
                                Invenzine is an E-magazine consisting of trending articles related to emerging companies.

                            </p>

                        </div>


                        <hr className="clearfix w-100 d-md-none pb-3" />


                        <div className="col-md-3 mb-md-0 mb-3">

                            <h5 className='text-uppercase'>Contact Us</h5>
                            <a href="mailto:" target='_self' className='text-light'><FontAwesomeIcon icon={faEnvelope} /> Email</a><br />
                            <span className='text-light'><FontAwesomeIcon icon={faPhone} /> Phone</span>
                        </div>

                        <div className="col-md-3 mb-md-0 mb-3">


                            <h5 class="text-uppercase">Links</h5>

                            <ul class="list-unstyled">
                                <li>
                                    <a href="/" className='text-light'>Home</a>
                                </li>
                                <li>
                                    <a href="/about" className='text-light'>About Us</a>
                                </li>
                                <li>
                                    <a href="/contact" className='text-light'>Contact Us</a>
                                </li>
                                <li>
                                    <a href="/profile" className='text-light'>Profile</a>
                                </li>
                                <li>
                                    <a href="/search" className='text-light'>Search</a>
                                </li>
                            </ul>

                        </div>

                        <div className="col-md-3 mb-md-0 mb-3">

                            <h5 className='text-uppercase'>Follow Us</h5>
                            <ul class="list-unstyled">
                                <li>
                                    <a href="#!" className='text-white'><FontAwesomeIcon icon={faFacebookF} /></a>
                                </li>
                                <li>
                                    <a href="#!" className='text-white'><FontAwesomeIcon icon={faTwitter} /></a>
                                </li>
                                <li>
                                    <a href="#!" className='text-white'><FontAwesomeIcon icon={faLinkedin} /></a>
                                </li>
                                <li>
                                    <a href="#!" className='text-white'><FontAwesomeIcon icon={faInstagram} /></a>
                                </li>
                            </ul>
                        </div>



                    </div>
                    <div className='container'>

                        <Row>
                            <Col md={15}>
                                <div className='mb-5 d-flex flex-center'>




                                </div>
                            </Col>
                        </Row>

                    </div>
                </div>

                <div class="footer-copyright text-center py-3">© 2020 Copyright:
    <a href="/"> Flotanomers</a>
                </div>

            </footer>
        )
    }
}

export default Footer
