import React from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import utilStyles from '../styles/utils.module.css'



export default class GameOverModal extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const modalState = this.props.modalState
        const title = this.props.title
        const resetBoard = this.props.resetBoard
        const body = this.props.body

        return (
            <Modal show={modalState} animation={false} backdrop="static" keyboard={false}>
                <Modal.Header className={`${utilStyles.bg_darkGrey} text-white`}>
                    <Modal.Title>
                        {title}
                        </Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${utilStyles.bg_darkGrey} text-white`}>
                    <p>
                        {body}
                    </p>
                </Modal.Body>
                <Modal.Footer className={`${utilStyles.bg_darkGrey} text-white`}>
                    <Button variant='success' onClick={resetBoard}>Try Again?</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}