import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import css from './css/tile.module.css'
import utilStyles from '../styles/utils.module.css'

/**
 * ActionConfirmModal Component - Confirmation dialog for game actions
 * 
 * Displays a modal to confirm arrest attempts or kill actions with target suspect info.
 * Shows the suspect's image, name, and action-specific messaging.
 * 
 * @class ActionConfirmModal
 * @extends {React.Component}
 */
export default class ActionConfirmModal extends React.Component {
    /**
     * Creates an instance of ActionConfirmModal
     * @param {Object} props - Component properties
     * @param {boolean} props.show - Whether modal is visible
     * @param {Function} props.onConfirm - Callback when action is confirmed
     * @param {Function} props.onCancel - Callback when action is cancelled
     * @param {Object} props.targetSuspect - Suspect object being targeted
     * @param {string} props.actionType - Type of action ('arrest' or 'kill')
     * @param {string} [props.playerName] - Name of the acting player
     * @memberof ActionConfirmModal
     */
    constructor(props) {
        super(props)
    }

    /**
     * Renders the confirmation modal with action-specific content
     * @returns {JSX.Element} The confirmation modal JSX
     * @memberof ActionConfirmModal
     */
    render() {
        const { show, onConfirm, onCancel, targetSuspect, actionType } = this.props

        if (!targetSuspect) return null

        const isArrest = actionType === 'arrest'
        const title = isArrest ? 'Attempt Arrest' : 'Eliminate Suspect'
        const buttonVariant = isArrest ? 'primary' : 'danger'
        const buttonText = isArrest ? 'Arrest' : 'Kill'

        return (
            <Modal show={show} onHide={onCancel} animation={false} backdrop="static" keyboard={false} centered>
                <Modal.Header className={`${utilStyles.bg_darkGrey} text-white`}>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${utilStyles.bg_darkGrey} text-white text-center`}>
                    <div className={css.modalEvidenceContainer} style={{justifyContent: 'center', marginBottom: '1rem'}}>
                        <div className={css.evidenceBody}>
                            <img 
                                className={css.evidenceImg} 
                                src={targetSuspect.alibied ? targetSuspect.alibiedImage : targetSuspect.image} 
                                alt={targetSuspect.name}
                            />
                            <span style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{targetSuspect.name}</span>
                        </div>
                    </div>
                    
                    <p>
                        {isArrest ? (
                            <>Are you sure you want to attempt to arrest <strong>{targetSuspect.name}</strong>?</>
                        ) : (
                            <>Are you sure you want to kill <strong>{targetSuspect.name}</strong>?</>
                        )}
                    </p>
                    
                    {targetSuspect.alibied && (
                        <div style={{color: '#ffc107', marginTop: '0.5rem'}}>
                            <small>⚠️ This suspect has an alibi</small>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className={`${utilStyles.bg_darkGrey}`}>
                    <Button variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant={buttonVariant} onClick={onConfirm}>
                        {buttonText}
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}