/**
 * KillerGameBoard - Killer-specific game implementation
 * Extends BaseGameBoard with killer-specific logic
 */

import Head from 'next/head'
import Layout from '../layout'
import BaseGameBoard from './BaseGameBoard'
import TurnIndicator from '../TurnIndicator'
import RulesModal from '../RulesModal'
import { GameService } from '../../services/gameService'
import css from '../css/tile.module.css'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import utilStyles from '../../styles/utils.module.css'
import SecretIdentity from '../secretIdentity'

export default class KillerGameBoard extends BaseGameBoard {
    constructor(props) {
        super(props)
        
        // Bind killer-specific methods
        this.alibiSuspect = this.alibiSuspect.bind(this)
        this.makeArrest = this.makeArrest.bind(this)
        this.changeIdentity = this.changeIdentity.bind(this)
        this.killSuspect = this.killSuspect.bind(this)
        this.detectivesTurn = this.detectivesTurn.bind(this)
        this.removeAlibiFromPlayer = this.removeAlibiFromPlayer.bind(this)
        this.toggleRulesModal = this.toggleRulesModal.bind(this)
        
        // Add rules modal state
        this.state = {
            ...this.state,
            showRulesModal: false
        }
    }

    /**
     * Returns initial game data for killer mode
     */
    getNewGameData() {
        const suspects = GameService.shuffle(GameService.cloneSuspectArray(this.suspectList))
        const evidenceDeck = GameService.shuffle(GameService.cloneSuspectArray(this.suspectList))
        
        const killerSelect = evidenceDeck.splice(0, 1)
        const playerSelect = evidenceDeck.splice(0, 4)
        
        return {
            suspects: GameService.populateBoardArray(suspects),
            evidenceDeck: evidenceDeck,
            killCount: 0,
            modalState: true,
            killersIdentity: killerSelect,
            detectiveIdentity: playerSelect.splice(0,1),
            alibiList: playerSelect,
            won: false,
            lost: false,
            whosTurn: this.KILLER,
            winMessage: '',
            showConfirmModal: false,
            confirmTarget: null
        }
    }

    /**
     * Override handleClose to mark killer's position when game starts
     */
    handleClose() {
        if (this.state.killersIdentity && this.state.killersIdentity[0]) {
            const killersLocation = this.getLocation(this.state.killersIdentity[0].id)
            let newSuspectArray = this.state.suspects
            newSuspectArray[killersLocation[0]][killersLocation[1]].isPlayer = true
            this.setState({ 
                modalState: !this.state.modalState,
                suspects: newSuspectArray
            })
        } else {
            this.setState({ modalState: !this.state.modalState })
        }
    }

    /**
     * Returns opponent turn identifier
     */
    getOpponentTurn() {
        return this.DETECTIVE
    }

    /**
     * Handles detective's automated turn
     */
    handleOpponentTurn() {
        this.detectivesTurn()
    }

    /**
     * Determines if player can act (killer's turn)
     */
    canPlayerAct() {
        return this.state.whosTurn === this.KILLER && this.state.killersIdentity?.[0]
    }

    /**
     * Determines if tile can be clicked for killing
     */
    canClickTile(suspect) {
        if (!this.canPlayerAct() || !suspect.alive) {
            return false
        }
        
        // Can't kill yourself
        if (suspect.id === this.state.killersIdentity[0].id) {
            return false
        }
        
        const killerLocation = GameService.getLocation(this.state.suspects, this.state.killersIdentity[0].id)
        const adjacentSuspects = GameService.getAdjacent(this.state.suspects, killerLocation)
        
        return adjacentSuspects.some(([row, col]) => 
            this.state.suspects[row][col].id === suspect.id
        )
    }

    /**
     * Executes kill action
     */
    executeAction(suspectId) {
        this.killSuspect(suspectId)
    }

    /**
     * Returns action type for confirmation modal
     */
    getActionType() {
        return 'kill'
    }

    /**
     * Detective's automated turn logic
     */
    detectivesTurn() {
        this.toggleTurnTxt(this.DETECTIVE)
        this.setProcessing(true) // Lock player actions
        const randomTime = Math.floor(Math.random() * 1500) + 500
        const moveOptions = [
            ['up', 0], ['up', 1], ['up', 2], ['up', 3], ['up', 4],
            ['down', 0], ['down', 1], ['down', 2], ['down', 3], ['down', 4],
            ['left', 0], ['left', 1], ['left', 2], ['left', 3], ['left', 4],
            ['right', 0], ['right', 1], ['right', 2], ['right', 3], ['right', 4]
        ]
        
        setTimeout(() => {
            const location = this.getLocation(this.state.detectiveIdentity[0].id)
            const availableArrests = this.getAdjacent(location)
            const availableAlibis = this.state.alibiList
            const alibiIndex = Math.floor(Math.random() * availableAlibis.length)
            const alibiToSelect = availableAlibis[alibiIndex]
            const randLocation = availableArrests[Math.floor(Math.random() * availableArrests.length)]
            const suspectToArrest = this.state.suspects[randLocation[0]][randLocation[1]]
            const moveButton = moveOptions[Math.floor(Math.random() * moveOptions.length)]
            
            let availableMoves = [
                () => { 
                    this.alibiSuspect(alibiIndex, alibiToSelect.id)
                    this.setProcessing(false) // Unlock player actions
                },
                () => { 
                    this.moveBoard(moveButton[1], moveButton[0], this.KILLER)
                    this.setProcessing(false) // Unlock player actions
                },
            ]
            
            if (randLocation !== undefined) {
                availableMoves.push(() => { 
                    this.makeArrest(suspectToArrest.id)
                    this.setProcessing(false) // Unlock player actions
                })
                availableMoves.push(() => { 
                    this.makeArrest(suspectToArrest.id)
                    this.setProcessing(false) // Unlock player actions
                })
            }
            
            const options = this.shuffle(availableMoves)
            options[Math.floor(Math.random() * options.length)]()
        }, randomTime)
    }
    
    /**
     * Kills a suspect
     */
    killSuspect(suspectId) {
        if (!this.state.killersIdentity || !this.state.killersIdentity[0]) {
            return false
        }
        
        const killersLocation = this.getLocation(this.state.killersIdentity[0].id)
        const availableKills = this.getAdjacent(killersLocation).map(loc => {
            return this.state.suspects[loc[0]][loc[1]]
        })
        
        if(suspectId === this.state.killersIdentity[0].id || !availableKills.some(suspect => suspect.id === suspectId)) {
            return false
        }
        
        const location = this.getLocation(suspectId)
        let newSuspectList = this.state.suspects
        newSuspectList[location[0]][location[1]].alive = false
        const killCount = this.state.killCount + 1
        const isDetectiveDead = newSuspectList[location[0]][location[1]].id === this.state.detectiveIdentity[0].id
        
        if (isDetectiveDead || killCount === 6) {
            this.setState({
                winMessage: isDetectiveDead
                    ? 'You have killed the lead detective, time to skip town!' 
                    : 'You have killed enough people, time to skip town!',
                killCount: killCount,
                won: true,
            })
        } else {
            this.removeAlibiFromPlayer(newSuspectList[location[0]][location[1]].id)
            this.setState({
                suspects: newSuspectList,
                killCount: killCount,
                whosTurn: this.DETECTIVE
            })
            this.detectivesTurn()
        }
    }

    /**
     * Alibis a suspect
     */
    alibiSuspect(alibiIndex, suspectId) {
        const location = this.getLocation(suspectId)
        let newSuspectList = this.state.suspects
        let alibiList = this.state.alibiList
        alibiList.splice(alibiIndex, 1)

        newSuspectList[location[0]][location[1]].alibied = true
        this.setState({
            suspects: newSuspectList,
        })
        
        if (this.state.evidenceDeck.length) {
            alibiList.push(this.state.evidenceDeck.splice(0, 1)[0])
            this.setState({
                alibiList: alibiList,
                whosTurn: this.KILLER
            })
        }
    }
    
    /**
     * Makes an arrest
     */
    makeArrest(suspectId) {
        let won = false
        if (this.state.killersIdentity && this.state.killersIdentity[0] && suspectId === this.state.killersIdentity[0].id) {
            won = !this.state.won
        }
        this.setState({
            won: won,
            whosTurn: this.KILLER
        })
    }

    /**
     * Changes killer's identity
     */
    changeIdentity() {
        if (!this.state.killersIdentity || !this.state.killersIdentity[0]) {
            return
        }
        
        const oldLocation = this.getLocation(this.state.killersIdentity[0].id)
        let newSuspectList = this.state.suspects
        let newKillerIdentity = null

        if (this.state.evidenceDeck.length) {
            newKillerIdentity = this.state.evidenceDeck.splice(0, 1)
            
            if (!newKillerIdentity[0].alive) {
                this.setState({
                    evidenceDeck: this.state.evidenceDeck,
                    whosTurn: this.DETECTIVE
                })
                this.detectivesTurn()
                return
            }
        } else {
            this.setState({
                whosTurn: this.DETECTIVE
            })
            this.detectivesTurn()
            return
        }
        
        // Mark old location as alibied and remove player marker
        newSuspectList[oldLocation[0]][oldLocation[1]].alibied = true
        newSuspectList[oldLocation[0]][oldLocation[1]].isPlayer = false
        
        // Mark new location with player marker
        const newLocation = this.getLocation(newKillerIdentity[0].id)
        newSuspectList[newLocation[0]][newLocation[1]].isPlayer = true
        
        this.setState({
            suspects: newSuspectList,
            evidenceDeck: this.state.evidenceDeck,
            killersIdentity: newKillerIdentity,
            whosTurn: this.DETECTIVE
        })
        this.detectivesTurn()
    }

    /**
     * Toggles the rules modal
     */
    toggleRulesModal() {
        this.setState({ showRulesModal: !this.state.showRulesModal })
    }

    /**
     * Removes alibi from player when killed
     */
    removeAlibiFromPlayer(suspectId) {
        let alibiList = this.state.alibiList
        for (const [alibiIndex, alibi] of alibiList.entries()) {
            if (alibi.id === suspectId) {
                alibiList.splice(alibiIndex, 1)
                if (this.state.evidenceDeck.length) {
                    alibiList.push(this.state.evidenceDeck.splice(0, 1)[0])
                }
            }
        }
        this.setState({
            alibiList: alibiList
        })
    }

    /**
     * Renders killer-specific UI
     */
    renderGameSpecificUI() {
        const { killersIdentity } = this.state

        const leftColumn = (
            <>
                <Row>
                    <Col md={12} className={css.evidenceHeader}>
                        <h4 className="text-center text-white mb-3">Killer Controls</h4>
                    </Col>
                </Row>
                
                <Row>
                    <Col md={12} className={css.evidenceHeader}>
                        <h5>Secret Identity</h5>
                        <div className={css.modalEvidenceContainer}>
                            {killersIdentity.map((alibi, i) => (
                                <SecretIdentity key={`secId-${i}`} id={alibi.id} name={alibi.name} alive={alibi.alive} image={alibi.image} />
                            ))}
                        </div>
                    </Col>
                </Row>
                
                <hr className="my-3" />
                
                <Row>
                    <Col md={12} className={css.evidenceHeader}>
                        <h5>Change Disguise</h5>
                        <p className="small text-muted mb-2">Switch to a new identity</p>
                        <Button 
                            variant="warning" 
                            onClick={this.changeIdentity}
                            className="w-100"
                            disabled={this.state.isProcessing}
                        >
                            🎭 Change Identity
                        </Button>
                    </Col>
                </Row>
                
                <hr className="my-3" />
                
                <Row>
                    <Col md={12} className={css.evidenceHeader}>
                        <h5>Elimination Action</h5>
                        <p className="small text-muted">Click adjacent suspects to eliminate</p>
                    </Col>
                </Row>
            </>
        )

        const rightColumn = (
            <>
                <Row>
                    <Col md={12}>
                        <TurnIndicator 
                            currentTurn={this.state.whosTurn}
                            killCount={this.state.killCount}
                            isProcessing={this.state.isProcessing}
                            gameMode="killer"
                        />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col md={12}>
                        <Button 
                            variant="outline-light" 
                            size="sm" 
                            onClick={this.toggleRulesModal}
                            className="w-100"
                        >
                            📋 View Rules
                        </Button>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col md={12} className={css.evidenceHeader}>
                        <h4 className="text-center text-white">Game Statistics</h4>
                        <h4>People Killed: {this.state.killCount}</h4>
                    </Col>
                </Row>
            </>
        )

        return { leftColumn, rightColumn }
    }

    /**
     * Renders killer-specific modals
     */
    renderGameSpecificModals() {
        const { modalState, killersIdentity, lost, killCount } = this.state
        const hasWon = this.state.won
        const winMsg = this.state.winMessage

        return (
            <>
                <Modal show={modalState} onHide={this.handleClose} animation={false} backdrop="static" keyboard={false}>
                    <Modal.Header className={`${utilStyles.bg_darkGrey} justify-content: center text-white`}>
                        <Modal.Title>
                            There's a Murderer on the loose!
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={`${utilStyles.bg_darkGrey} text-white`}>
                        <h1 className='text-center'>
                            And it's <b>YOU</b> {killersIdentity && killersIdentity[0] ? killersIdentity[0].name : ''}
                        </h1>
                        <p className={css.evidenceHeader}>
                            You feel the urge rise in you after years in hiding.
                            Your bloodlust won't end until you <b className={css.textRed}>murder 6 people</b>, then you can move on to the next town.
                            Beware though! The detectives In these parts are like bloodhounds.
                        </p>
                        <hr />
                        <div className={css.modalEvidenceContainer}>
                            {killersIdentity.map((alibi, i) => (
                                <SecretIdentity key={`secId-${i}-start`} id={alibi.id} name={alibi.name} alive={alibi.alive} image={alibi.image} />
                            ))}
                        </div>
                        <Button className={`text-center`} onClick={this.handleClose}>Start</Button>
                    </Modal.Body>
                </Modal>

                <Modal show={lost} animation={false} backdrop="static" keyboard={false}>
                    <Modal.Header className={`${utilStyles.bg_darkGrey} text-white`}>
                        <Modal.Title>You've been caught by the detective.</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={`${utilStyles.bg_darkGrey} text-white`}>
                        <p>
                            {(killCount === 6
                                ? `You let the killer get away with too many murders!`
                                : `You were killed by ${killersIdentity && killersIdentity[0] ? killersIdentity[0].name : 'the killer'}`
                            )}
                        </p>
                    </Modal.Body>
                    <Modal.Footer className={`${utilStyles.bg_darkGrey} text-white`}>
                        <Button variant='success' onClick={this.resetBoard}>Try Again?</Button>
                    </Modal.Footer>
                </Modal>
                
                <Modal show={hasWon} animation={false} backdrop="static" keyboard={false}>
                    <Modal.Header className={`${utilStyles.bg_darkGrey} text-white justify-content: center`}>
                        <Modal.Title>Congratulations</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={`${utilStyles.bg_darkGrey} text-white`}>
                        <div className={css.evidenceHeader}>
                            {winMsg}
                        </div>
                    </Modal.Body>
                    <Modal.Footer className={`${utilStyles.bg_darkGrey} text-white`}>
                        <Button variant='success' onClick={this.resetBoard}>Play Again?</Button>
                    </Modal.Footer>
                </Modal>

                <RulesModal 
                    show={this.state.showRulesModal}
                    onHide={this.toggleRulesModal}
                    mode="killer"
                    showModeSelector={false}
                />
            </>
        )
    }

    render() {
        return (
            <Layout>
                <Head>
                    <title>Game Board</title>
                </Head>
                {super.render()}
            </Layout>
        )
    }
}