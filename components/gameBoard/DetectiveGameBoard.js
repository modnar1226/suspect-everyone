/**
 * DetectiveGameBoard - Detective-specific game implementation
 * Extends BaseGameBoard with detective-specific logic
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
import Alibi from '../alibi'
import SecretIdentity from '../secretIdentity'
import utilStyles from '../../styles/utils.module.css'
import StartModal from '../startModal'
import GameOverModal from '../gameOverModal'

export default class DetectiveGameBoard extends BaseGameBoard {
    constructor(props) {
        super(props)
        
        // Bind detective-specific methods
        this.alibiSuspect = this.alibiSuspect.bind(this)
        this.makeArrest = this.makeArrest.bind(this)
        this.setIdentity = this.setIdentity.bind(this)
        this.killersTurn = this.killersTurn.bind(this)
        this.killSuspect = this.killSuspect.bind(this)
        this.changeIdentity = this.changeIdentity.bind(this)
        this.removeAlibiFromPlayer = this.removeAlibiFromPlayer.bind(this)
        this.wasAlibiKilled = this.wasAlibiKilled.bind(this)
        this.markAlibiKilled = this.markAlibiKilled.bind(this)
        this.markEvidenceKilled = this.markEvidenceKilled.bind(this)
        this.toggleRulesModal = this.toggleRulesModal.bind(this)
        
        // Add rules modal state
        this.state = {
            ...this.state,
            showRulesModal: false
        }
    }

    /**
     * Returns initial game data for detective mode
     */
    getNewGameData() {
        const suspects = GameService.shuffle(GameService.cloneSuspectArray(this.suspectList))
        const evidenceDeck = GameService.shuffle(GameService.cloneSuspectArray(this.suspectList))
        
        const killersIdentity = evidenceDeck.splice(0, 1)
        const playerSelect = evidenceDeck.splice(0, 4)
        
        return {
            suspects: GameService.populateBoardArray(suspects),
            evidenceDeck: evidenceDeck,
            killCount: 0,
            modalState: true,
            secretIdentity: [],
            alibiList: [],
            killersIdentity: killersIdentity,
            playerSelect: playerSelect,
            won: false,
            lost: false,
            whosTurn: this.DETECTIVE,
            showConfirmModal: false,
            confirmTarget: null
        }
    }

    /**
     * Returns opponent turn identifier
     */
    getOpponentTurn() {
        return this.KILLER
    }

    /**
     * Handles killer's automated turn
     */
    handleOpponentTurn() {
        this.killersTurn()
    }

    /**
     * Determines if player can act (detective's turn)
     */
    canPlayerAct() {
        return this.state.whosTurn === this.DETECTIVE && this.state.secretIdentity?.[0]
    }

    /**
     * Determines if tile can be clicked for arrest
     */
    canClickTile(suspect) {
        if (!this.canPlayerAct() || !suspect.alive) {
            return false
        }
        
        const detectiveLocation = GameService.getLocation(this.state.suspects, this.state.secretIdentity[0].id)
        const adjacentSuspects = GameService.getAdjacent(this.state.suspects, detectiveLocation, true)
        
        return adjacentSuspects.some(([row, col]) => 
            this.state.suspects[row][col].id === suspect.id
        )
    }

    /**
     * Executes arrest action
     */
    executeAction(suspectId) {
        this.makeArrest(suspectId)
    }

    /**
     * Returns action type for confirmation modal
     */
    getActionType() {
        return 'arrest'
    }

    /**
     * Killer's automated turn logic
     */
    killersTurn() {
        this.toggleTurnTxt(this.KILLER)
        this.setProcessing(true) // Lock player actions
        const randomTime = Math.floor(Math.random() * 4000) + 1500
        const moveOptions = [
            ['up', 0], ['up', 1], ['up', 2], ['up', 3], ['up', 4],
            ['down', 0],['down', 1],['down', 2],['down', 3],['down', 4],
            ['left', 0], ['left', 1], ['left', 2], ['left', 3], ['left', 4],
            ['right', 0], ['right', 1], ['right', 2], ['right', 3], ['right', 4]
        ]
        
        setTimeout(() => {
            if (!this.state.killersIdentity || !this.state.killersIdentity[0]) {
                return
            }
            
            const killersLocation = GameService.getLocation(this.state.suspects, this.state.killersIdentity[0].id)
            const availableKills = GameService.getAdjacent(this.state.suspects, killersLocation)
            const location = availableKills[Math.floor(Math.random() * availableKills.length)]
            const moveButton = moveOptions[Math.floor(Math.random() * moveOptions.length)]
            
            let availableMoves = [
                () => { this.changeIdentity(this.state.killersIdentity[0].id) },
                () => { 
                    const newSuspects = GameService.moveBoard(this.state.suspects, moveButton[1], moveButton[0])
                    this.setState({ suspects: newSuspects, whosTurn: this.DETECTIVE })
                    this.setProcessing(false) // Unlock player actions
                },
            ]
            
            if (location !== undefined) {
                availableMoves.push(() => { this.killSuspect(location) })
                availableMoves.push(() => { this.killSuspect(location) })
            }
            
            const options = this.shuffle(availableMoves)
            options[Math.floor(Math.random() * options.length)]()
        }, randomTime)
    }

    /**
     * Kills a suspect
     */
    killSuspect(location) {
        let newSuspectList = this.state.suspects
        newSuspectList[location[0]][location[1]].alive = false
        const suspectId = newSuspectList[location[0]][location[1]].id
        const killCount = this.state.killCount + 1
        
        if ((this.state.secretIdentity && this.state.secretIdentity[0] && suspectId === this.state.secretIdentity[0].id) || killCount === 6) {
            this.setState({
                killCount: killCount,
                lost: true,
            })
            this.setProcessing(false) // Unlock player actions
        } else {
            const alibiKilled = this.wasAlibiKilled(suspectId)
            
            if (alibiKilled[0]) {
                this.markAlibiKilled(alibiKilled[1])
            } else {
                this.markEvidenceKilled(suspectId)
            }
            
            this.setState({
                suspects: newSuspectList,
                killCount: killCount,
                whosTurn: this.DETECTIVE
            })
            this.setProcessing(false) // Unlock player actions
        }
    }

    /**
     * Sets detective's identity
     */
    setIdentity(index) {
        this.handleClose()
        const secretIdentity = this.state.playerSelect[index]
        this.state.playerSelect.splice(index, 1)
        const playersLocation = this.getLocation(secretIdentity.id)
        let newSuspectArray = this.state.suspects
        newSuspectArray[playersLocation[0]][playersLocation[1]].isPlayer = true
        
        this.setState({
            suspects: newSuspectArray,
            secretIdentity: [secretIdentity],
            alibiList: this.state.playerSelect,
            playerSelect: []
        }, () => {
            if (!this.state.killersIdentity || !this.state.killersIdentity[0]) return
            const killersLocation = this.getLocation(this.state.killersIdentity[0].id)
            const availableKills = this.getAdjacent(killersLocation)
            const location = availableKills[Math.floor(Math.random() * availableKills.length)]
            this.killSuspect(location)
        })
    }

    /**
     * Alibis a suspect
     */
    alibiSuspect(alibiIndex, suspectId) {
        const location = this.getLocation(suspectId)
        let newSuspectList = this.state.suspects
        let alibiList = this.state.alibiList
        const clicked = alibiList.splice(alibiIndex, 1)

        if (!clicked[0].alive) {
            if (this.state.evidenceDeck.length) {
                alibiList.push(this.state.evidenceDeck.splice(0, 1)[0])
                this.setState({
                    alibiList: alibiList
                })
                return
            }
        }
        
        newSuspectList[location[0]][location[1]].alibied = true
        this.setState({
            suspects: newSuspectList,
        })
        this.killersTurn()

        if (this.state.evidenceDeck.length) {
            alibiList.push(this.state.evidenceDeck.splice(0, 1)[0])
            this.setState({
                alibiList: alibiList
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
        } else {
            this.killersTurn()
        }
        this.setState({
            won: won
        })
    }

    /**
     * Changes killer's identity
     */
    changeIdentity(suspectId) {
        const location = this.getLocation(suspectId)
        let newSuspectList = this.state.suspects
        let newKillerIdentity

        if (this.state.evidenceDeck.length) {
            newKillerIdentity = this.state.evidenceDeck.splice(0, 1)
            if (!newKillerIdentity[0].alive) {
                this.setState({
                    evidenceDeck: this.state.evidenceDeck,
                    whosTurn: this.DETECTIVE
                })
                this.setProcessing(false) // Unlock player actions
                return
            }
        }

        newSuspectList[location[0]][location[1]].alibied = true
        this.setState({
            suspects: newSuspectList,
            evidenceDeck: this.state.evidenceDeck,
            killersIdentity: newKillerIdentity,
            whosTurn: this.DETECTIVE
        })
        this.setProcessing(false) // Unlock player actions
    }

    /**
     * Toggles the rules modal
     */
    toggleRulesModal() {
        this.setState({ showRulesModal: !this.state.showRulesModal })
    }

    // Helper methods for alibi and evidence management
    wasAlibiKilled(suspectId) {
        let wasKilled = [false]
        for (const [aIndex, alibi] of this.state.alibiList.entries()) {
            if (suspectId === alibi.id) {
                wasKilled[0] = true
                wasKilled[1] = aIndex
                break
            }
        }
        return wasKilled
    }

    markAlibiKilled(index) {
        let newAlibiList = this.state.alibiList
        newAlibiList[index].alive = false
        this.setState({
            alibiList: newAlibiList
        })
    }

    markEvidenceKilled(suspectId) {
        let newEvidenceDeck = this.state.evidenceDeck
        for (const [eIndex, evidence] of this.state.evidenceDeck.entries()) {
            if (suspectId === evidence.id) {
                newEvidenceDeck[eIndex].alive = false
                this.setState({
                    evidenceDeck: newEvidenceDeck
                })
                break
            }
        }
    }

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
     * Renders detective-specific UI
     */
    renderGameSpecificUI() {
        const { alibiList, secretIdentity, whosTurn, killCount } = this.state

        const leftColumn = (
            <>
                <Row>
                    <Col md={12} className={css.evidenceHeader}>
                        <h4 className="text-center text-white mb-3">Detective Controls</h4>
                    </Col>
                </Row>
                
                <Row>
                    <Col md={12} className={css.evidenceHeader}>
                        <h5>Secret Identity</h5>
                        <div className={css.modalEvidenceContainer}>
                            {secretIdentity.map((alibi, i) => (
                                <SecretIdentity key={`secId-${i}`} id={alibi.id} name={alibi.name} alive={alibi.alive} image={alibi.image} />
                            ))}
                        </div>
                    </Col>
                </Row>
                
                <hr className="my-3" />
                
                <Row>
                    <Col md={12} className={css.evidenceHeader}>
                        <h5>Alibis</h5>
                        <p className="small text-muted mb-2">Click alibis to use them</p>
                        <div className={css.modalEvidenceContainer}>
                            {alibiList.map((alibi, i) => (
                                <Alibi 
                                    key={`alibi-${alibi.id}`}
                                    alibiSuspect={this.alibiSuspect}
                                    alibiIndex={i}
                                    susId={alibi.id}
                                    name={alibi.name}
                                    image={alibi.image}
                                    alive={alibi.alive}
                                />
                            ))}
                        </div>
                    </Col>
                </Row>
                
                <hr className="my-3" />
                
                <Row>
                    <Col md={12} className={css.evidenceHeader}>
                        <h5>Arrest Action</h5>
                        <p className="small text-muted">Click adjacent suspects to attempt arrest</p>
                    </Col>
                </Row>
            </>
        )

        const rightColumn = (
            <>
                <Row>
                    <Col md={12}>
                        <TurnIndicator 
                            currentTurn={whosTurn}
                            killCount={killCount}
                            isProcessing={this.state.isProcessing}
                            gameMode="detective"
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
                        <h4>People Killed: {killCount}</h4>
                    </Col>
                </Row>
            </>
        )

        return { leftColumn, rightColumn }
    }

    /**
     * Renders detective-specific modals
     */
    renderGameSpecificModals() {
        const { modalState, playerSelect, secretIdentity, lost, won, killCount, killersIdentity } = this.state

        return (
            <>
                <StartModal 
                    modalState={modalState && playerSelect && playerSelect.length > 0 && secretIdentity && secretIdentity.length === 0}
                    title="Welcome Detective."
                    playerSelect={playerSelect}
                    setIdentity={this.setIdentity}
                />

                <GameOverModal 
                    modalState={false}
                    title=""
                    playerSelect={playerSelect}
                    setIdentity={this.setIdentity}
                />                   

                <Modal show={lost} animation={false} backdrop="static" keyboard={false}>
                    <Modal.Header className={`${utilStyles.bg_darkGrey} text-white`}>
                        <Modal.Title>{(killCount === 6 ? 'You\'re off the case' : 'RIP')}</Modal.Title>
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
                
                <Modal show={won} animation={false} backdrop="static" keyboard={false}>
                    <Modal.Header className={`${utilStyles.bg_darkGrey} text-white justify-content: center`}>
                        <Modal.Title>Congratulations</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={`${utilStyles.bg_darkGrey} text-white`}>
                        <div className={css.evidenceHeader}>
                            You have found the killer!
                        </div>
                    </Modal.Body>
                    <Modal.Footer className={`${utilStyles.bg_darkGrey} text-white`}>
                        <Button variant='success' onClick={this.resetBoard}>Play Again?</Button>
                    </Modal.Footer>
                </Modal>

                <RulesModal 
                    show={this.state.showRulesModal}
                    onHide={this.toggleRulesModal}
                    mode="detective"
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