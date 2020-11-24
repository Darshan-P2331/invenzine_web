import React from 'react'
import {Modal, Button} from 'react-bootstrap'
import {EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, WhatsappIcon, WhatsappShareButton} from 'react-share'

function Share(props) {
    return (
        <Modal
        {...props}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        >
            <Modal.Header closeButton>
                <Modal.Title id='contained-modal-title-vcenter'>
                    Share to
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='text-center'>
                <EmailShareButton subject={props.title} url={window.location.href} className='mx-2'>
                    <EmailIcon size={36} round />
                </EmailShareButton>
                <FacebookShareButton title={props.title} url={window.location.href} className='mx-1'>
                    <FacebookIcon size={36} round />
                </FacebookShareButton>
                <WhatsappShareButton title={props.title} url={window.location.href} className='mx-2'>
                    <WhatsappIcon round size={36} />
                </WhatsappShareButton>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Share

