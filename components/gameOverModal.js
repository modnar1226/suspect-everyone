import css from './css/tile.module.css'
import Evidence from './evidence'

import React from 'react'
import Modal from 'react-bootstrap/Modal'
import utilStyles from '../styles/utils.module.css'



export default class GameOverModal extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const modalState = this.props.modalState
        const title = this.props.title
        const playerSelect = this.props.playerSelect
        const setIdentity = this.props.setIdentity

        return (
            <Modal show={modalState} animation={false} backdrop="static" keyboard={false}>
                <Modal.Header className={`${utilStyles.bg_darkGrey} text-white`}>
                    <Modal.Title>
                        {title}
                        </Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${utilStyles.bg_darkGrey} text-white`}>
                    <p className={css.evidenceHeader}>
                        There is a killer on the loose and you have to catch them before they kill 6 people.
                        </p>
                    <p className={css.evidenceHeader}>
                        Pick a secret identity to begin!
                        </p>
                    <hr />
                    <div className={css.evidenceHeader}>
                        {playerSelect && playerSelect.map((alibi, i) => {
                            return (
                                <Evidence key={`player-${i}`} setIdentity={setIdentity} selectIndex={i} name={alibi.name} image={alibi.image}></Evidence>
                            )
                        })}
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}