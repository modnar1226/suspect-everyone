/**
 * BaseGameBoard - Shared base class for Detective and Killer game boards
 * 
 * Contains all common functionality:
 * - Board movement and manipulation
 * - Suspect management utilities
 * - Game state initialization
 * - Tile interaction handlers
 */

import React from 'react'
import GameBoard from '../gameBoard'
import ActionConfirmModal from '../actionConfirmModal'
import { GameService } from '../../services/gameService'
import css from '../css/tile.module.css'
import Suspects from '../../mappings/suspectList'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import utilStyles from '../../styles/utils.module.css'

export default class BaseGameBoard extends React.Component {
    constructor(props) {
        super(props)
        
        // Bind shared methods
        this.handleClick = this.handleClick.bind(this)
        this.handleShow = this.handleShow.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.resetBoard = this.resetBoard.bind(this)
        this.onTileClick = this.onTileClick.bind(this)
        this.canClickTile = this.canClickTile.bind(this)
        this.confirmTileAction = this.confirmTileAction.bind(this)
        this.cancelTileAction = this.cancelTileAction.bind(this)
        
        this.suspectList = Suspects
        
        this.KILLER = 'Killer'
        this.DETECTIVE = 'Detective'
        
        // Initialize with static data first to prevent hydration mismatch
        this.state = {
            ...GameService.getInitialState(this.suspectList),
            isProcessing: false // Turn lockout state
        }
    }

    componentDidMount() {
        // Initialize game data after mounting to prevent hydration issues
        if (!this.state.gameInitialized) {
            const newGameData = this.getNewGameData()
            
            this.setState({
                ...newGameData,
                gameInitialized: true
            })
        }
    }

    /**
     * Abstract method - must be implemented by child classes
     * Returns initial game state specific to game mode
     */
    getNewGameData() {
        throw new Error('getNewGameData must be implemented by child class')
    }

    /**
     * Resets the game board to initial state
     */
    resetBoard() {
        this.setState(this.getNewGameData())
    }

    /**
     * Toggles turn indicator
     */
    toggleTurnTxt(newValue) {
        this.setState({
            whosTurn: newValue
        })
    }

    /**
     * Handles board movement clicks
     */
    handleClick(index, direction) {
        if (this.state.isProcessing) {
            return // Prevent moves during AI processing
        }
        
        this.moveBoard(index, direction, this.getOpponentTurn())
        this.handleOpponentTurn()
    }

    /**
     * Abstract method - returns the opponent's turn identifier
     */
    getOpponentTurn() {
        throw new Error('getOpponentTurn must be implemented by child class')
    }

    /**
     * Abstract method - handles the opponent's turn logic
     */
    handleOpponentTurn() {
        throw new Error('handleOpponentTurn must be implemented by child class')
    }

    /**
     * Shows/hides modal
     */
    handleShow() {
        this.setState({ modalState: !this.state.modalState })
    }

    handleClose() {
        this.setState({ modalState: !this.state.modalState })
    }

    /**
     * Moves the game board in specified direction
     */
    moveBoard(index, direction, whosTurn) {
        const newSuspects = GameService.moveBoard(this.state.suspects, index, direction)
        this.setState({
            suspects: newSuspects,
            whosTurn: whosTurn
        })
    }

    /**
     * Finds location of suspect by ID
     */
    getLocation(personId) {
        return GameService.getLocation(this.state.suspects, personId)
    }

    /**
     * Gets adjacent positions to a location
     */
    getAdjacent(location, getPlayer = false) {
        return GameService.getAdjacent(this.state.suspects, location, getPlayer)
    }

    /**
     * Shuffles an array using Fisher-Yates algorithm
     */
    shuffle(array) {
        return GameService.shuffle(array)
    }

    /**
     * Handle tile clicks for game actions (arrest/kill)
     */
    onTileClick(suspectProps) {
        if (!this.canPlayerAct() || this.state.isProcessing) {
            return // Prevent actions during AI processing
        }
        
        this.setState({
            showConfirmModal: true,
            confirmTarget: suspectProps
        })
    }

    /**
     * Sets processing state to lock/unlock player actions
     */
    setProcessing(isProcessing) {
        this.setState({ isProcessing })
    }

    /**
     * Abstract method - determines if player can act
     */
    canPlayerAct() {
        throw new Error('canPlayerAct must be implemented by child class')
    }

    /**
     * Abstract method - determines if a tile can be clicked
     */
    canClickTile(suspect) {
        throw new Error('canClickTile must be implemented by child class')
    }

    /**
     * Confirms the tile action (arrest/kill)
     */
    confirmTileAction() {
        if (this.state.confirmTarget) {
            this.executeAction(this.state.confirmTarget.id)
            this.setState({
                showConfirmModal: false,
                confirmTarget: null
            })
        }
    }

    /**
     * Abstract method - executes the game action
     */
    executeAction(suspectId) {
        throw new Error('executeAction must be implemented by child class')
    }

    /**
     * Cancels the tile action
     */
    cancelTileAction() {
        this.setState({
            showConfirmModal: false,
            confirmTarget: null
        })
    }

    /**
     * Abstract method - returns the action type for confirmation modal
     */
    getActionType() {
        throw new Error('getActionType must be implemented by child class')
    }

    /**
     * Abstract method - renders game-specific UI elements
     */
    renderGameSpecificUI() {
        throw new Error('renderGameSpecificUI must be implemented by child class')
    }

    /**
     * Abstract method - renders game-specific modals
     */
    renderGameSpecificModals() {
        throw new Error('renderGameSpecificModals must be implemented by child class')
    }

    /**
     * Shared render method - provides common layout structure
     */
    render() {
        const suspects = this.state.suspects

        return (
            <>
                <Row className={`text-white`}>
                    <Col md={3}>
                        {this.renderGameSpecificUI().leftColumn}
                    </Col>
                    <Col md={6}>
                        <GameBoard 
                            suspects={suspects} 
                            handleClick={this.handleClick}
                            onTileClick={this.onTileClick}
                            canClickTile={this.canClickTile}
                        />
                    </Col>
                    <Col md={3}>
                        {this.renderGameSpecificUI().rightColumn}
                    </Col>
                </Row>

                {this.renderGameSpecificModals()}
                
                {/* Shared Confirmation Modal */}
                <ActionConfirmModal 
                    show={this.state.showConfirmModal}
                    onConfirm={this.confirmTileAction}
                    onCancel={this.cancelTileAction}
                    targetSuspect={this.state.confirmTarget}
                    actionType={this.getActionType()}
                />
            </>
        )
    }
}