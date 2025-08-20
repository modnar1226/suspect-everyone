/**
 * Original game created by Maureen Birdsall and husband Mike
 * React version of game created by Ian Greene Nov 2020 
 */

import Head from 'next/head'
import Layout from '../../components/layout'
import GameBoard from '../../components/gameBoard'
import { GameService } from '../../services/gameService'
import css from '../../components/css/tile.module.css'
import React from 'react'
import Suspects from '../../mappings/suspectList'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Alibi from '../../components/alibi'
import Suspect from '../../components/suspect'
import SecretIdentity from '../../components/secretIdentity'
import utilStyles from '../../styles/utils.module.css'
import StartModal from '../../components/startModal'
import GameOverModal from '../../components/gameOverModal'
import ArrestListModal from '../../components/arrestListModal'

export default class DetectiveGameBoard extends React.Component{
    constructor(props){
        super(props)
        
        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this)
        this.handleShow = this.handleShow.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.alibiSuspect = this.alibiSuspect.bind(this)
        this.arrestSuspect = this.arrestSuspect.bind(this)
        this.makeArrest = this.makeArrest.bind(this)
        this.resetBoard = this.resetBoard.bind(this)
        this.closeArrest = this.closeArrest.bind(this)
        this.suspectList = Suspects
        
        this.KILLER = 'Killer'
        this.DETECTIVE = 'Detective'
        
        // Initialize with static data first to prevent hydration mismatch
        this.state = this.getInitialState()
        this.setIdentity = this.setIdentity.bind(this)
        
    }

    componentDidMount() {
        // Initialize game data after mounting to prevent hydration issues
        
        // Only initialize if not already done
        if (!this.state.gameInitialized) {
            const newGameData = this.newBoard()
            
            this.setState({
                ...newGameData,
                gameInitialized: true
            }, () => {
               
            })
        }
    }

    getInitialState() {
        // Always return static data to ensure server/client render match
        
        const staticSuspects = this.cloneSuspectArray(this.suspectList)
        return {
            suspects: this.populateBoardArray(staticSuspects),
            evidenceDeck: [],
            killCount: 0,
            modalState: false,
            secretIdentity: [],
            alibiList: [],
            killersIdentity: [],
            playerSelect: [],
            won: false,
            lost: false,
            showArrestList: false,
            arrestList: [],
            whosTurn: this.DETECTIVE,
            gameInitialized: false
        }
    }

    newBoard(){
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
            showArrestList: false,
            arrestList: [],
            whosTurn: this.DETECTIVE
        }
    }

    resetBoard(){
        this.setState(
            this.newBoard()
        )
    }

    componentWillUnmount() {

    }

    killersTurn(){
        this.toggleTurnTxt(this.KILLER)
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
                },
            ]
            if (location !== undefined) {
                availableMoves.push(() => { this.killSuspect(location) })
                availableMoves.push(() => { this.killSuspect(location) })
            }
            // execute the move
            const options = this.shuffle(availableMoves)
            options[Math.floor(Math.random() * options.length)]()
        }, randomTime)
    }

    toggleTurnTxt(newValue){
        this.setState({
            whosTurn: newValue
        })
    }

    killSuspect(location){
        let newSuspectList = this.state.suspects
        newSuspectList[location[0]][location[1]].alive = false
        const suspectId = newSuspectList[location[0]][location[1]].id
        const killCount = this.state.killCount + 1
        if ((this.state.secretIdentity && this.state.secretIdentity[0] && suspectId === this.state.secretIdentity[0].id) || killCount === 6) {
            this.setState({
                killCount: killCount,
                lost:true,
            })
        } else {
            const alibiKilled = this.wasAlibiKilled(suspectId);
            
            if (alibiKilled[0]) {
                this.markAlibiKilled(alibiKilled[1])
            } else {
                this.markEvidenceKilled(suspectId)
            }
            // condtional on whether the suspect was killed
            //this.removeAlibiFromPlayer(newSuspectList[location[0]][location[1]].id)
            this.setState({
                suspects: newSuspectList,
                killCount: killCount,
                whosTurn: this.DETECTIVE
            })
        }
    }

    wasAlibiKilled(suspectId){
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

    markAlibiKilled(index){
        let newAlibiList = this.state.alibiList
        newAlibiList[index].alive = false
        this.setState({
            alibiList: newAlibiList
        })
    }

    markEvidenceKilled(suspectId){
        let newEvidenceDeck = this.state.evidenceDeck
        for (const [eIndex, evidence] of this.state.evidenceDeck.entries()) {
            if (suspectId === evidence.id) {
                newEvidenceDeck[eIndex].alive = false
                this.setState({
                    evidenceDeck : newEvidenceDeck
                })
                break
            }
        }
    }

    getLocation(personId){
        let rowIndex = null;
        let colIndex = null;

        for (const[index, row] of this.state.suspects.entries()) {
            for (const [cIndex, suspect] of row.entries()){
                if (suspect.id === personId) {
                    rowIndex = index
                    colIndex = cIndex
                    break
                }
            }
        }

        return [rowIndex,colIndex]
    }

    getAdjacent(location, getPlayer=false){
        const rowIndex = location[0]
        const colIndex = location[1]

        const rowMinus = rowIndex - 1
        const rowPlus  = rowIndex + 1
        const colMinus = colIndex - 1
        const colPlus  = colIndex + 1
        
        let adjacent = [ 
            // top row
            [rowMinus, colMinus],     [rowMinus, colIndex],   [rowMinus, colPlus],
            // mid row
            [rowIndex, colMinus],     /* person's location */ [rowIndex, colPlus],
            // bot row
            [rowPlus, colMinus],      [rowPlus, colIndex],    [rowPlus, colPlus] 
        ]
        if (getPlayer) {
            adjacent.splice(4,0,[rowIndex, colIndex])
        }

        let validSelection = []
        for (const arr of adjacent) {
            if (arr[0] >= 0 && arr[0] <= 4 && arr[1] >= 0 && arr[1] <= 4) {
                if (this.state.suspects[arr[0]][arr[1]].alive) {
                    validSelection.push(arr)
                }
            }
        }
        return validSelection
    }

    shuffle(array) {
        // Proper Fisher-Yates shuffle
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    populateBoardArray(susArray){
        var result = susArray.reduce((resultArray, item, index) => {
            const chunkIndex = Math.floor(index / 5)

            if (!resultArray[chunkIndex]) {
                resultArray[chunkIndex] = [] // start a new chunk
            }

            resultArray[chunkIndex].push(item)

            return resultArray
        }, [])
        return result
    }

    cloneSuspectArray(susArray){
        return susArray.map(obj => Object.assign({}, obj))
    }

    getSuspectCol(index){
        return this.state.suspects.map((row) => {
            return row[index];
        })
    }

    // returns the array of suspects at 'index'
    getSuspectRow(index) {
        return this.state.suspects[index]
    }

    shiftSuspect(toShift,dir){
        switch (dir) {
            case 'up' :
                const shiftingUp = toShift[0]
                toShift.splice(0, 1)
                toShift.push(shiftingUp)
                return toShift
            case 'down':
                const shiftingDown = toShift[4]
                toShift.splice(4, 1)
                toShift.unshift(shiftingDown)
                return toShift
            case 'left':
                const shiftingLeft = toShift[0]
                toShift.splice(0, 1)
                toShift.push(shiftingLeft)
                return toShift
            case 'right':
                const shiftingRight = toShift[4]
                toShift.splice(4, 1)
                toShift.unshift(shiftingRight)
                return toShift
            default:
                break
        }
    }

    /**
     * sets the detectives secret identity, 
     * removes the index from the alibiList array, 
     * closes the modal
     **/ 
    setIdentity(index){
        this.handleClose();
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
        }, () => { // this runs after setState
            // killer goes first and must make a kill
            if (!this.state.killersIdentity || !this.state.killersIdentity[0]) return
            const killersLocation = this.getLocation(this.state.killersIdentity[0].id)
            const availableKills = this.getAdjacent(killersLocation)
            const location = availableKills[Math.floor(Math.random() * availableKills.length)]
            this.killSuspect(location)
        })
    }
    
    handleClick(index, direction){
        this.moveBoard(index, direction, this.KILLER)
        this.killersTurn()
    }

    handleShow() {
        this.setState({ modalState: !this.state.modalState })
    }
    handleClose(){
        this.setState({ modalState: !this.state.modalState })
    }

    closeArrest(){
        this.setState({ showArrestList: !this.state.showArrestList })
    }

    alibiSuspect(alibiIndex,suspectId){
        const location = this.getLocation(suspectId)
        let newSuspectList = this.state.suspects
        let alibiList = this.state.alibiList
        const clicked = alibiList.splice(alibiIndex,1)

        if (!clicked[0].alive) {
            if (this.state.evidenceDeck.length) {
                alibiList.push(this.state.evidenceDeck.splice(0, 1)[0])
                this.setState({
                    alibiList: alibiList
                })
                return;
            }
        }
        newSuspectList[location[0]][location[1]].alibied = true
        this.setState({
            suspects: newSuspectList,
        })
        this.killersTurn()

        //this should be done after the killers turn
        if (this.state.evidenceDeck.length) {
            alibiList.push(this.state.evidenceDeck.splice(0, 1)[0])
            this.setState({
                alibiList: alibiList
            })
        }
    }

    arrestSuspect(){
        if (!this.state.secretIdentity || !this.state.secretIdentity[0]) return
        const location = this.getLocation(this.state.secretIdentity[0].id)
        const availableArrests = this.getAdjacent(location, true)
        let arrestList = []
        availableArrests.map((location) => {
            arrestList.push(this.state.suspects[location[0]][location[1]])
        })        
        this.setState({
            showArrestList: !this.state.showArrestList,
            arrestList: arrestList
        })
    }

    makeArrest(suspectId){
        const location = this.getLocation(suspectId)
        let won = false
        if (this.state.killersIdentity && this.state.killersIdentity[0] && suspectId === this.state.killersIdentity[0].id) {
            won = !this.state.won    
        } else{
            this.killersTurn()
        }
        this.setState({
            showArrestList: !this.state.showArrestList,
            won: won,
            arrestList: []
        })
    }

    moveBoard(index, direction, whosTurn){
        if (direction === 'left' || direction === 'right') {
            this.state.suspects[index] = this.shiftSuspect(this.getSuspectRow(index), direction)
        } else { // up or down
            // need to rebuild rows with new values in given index
            let newCols = this.shiftSuspect(this.getSuspectCol(index), direction)
            const oldsuspects = this.state.suspects
            this.state.suspects = []
            oldsuspects.forEach((row, i) => {
                row[index] = newCols[i]
                this.state.suspects.push(row)
            })
        }
        this.setState({
            suspects: this.state.suspects,
            whosTurn: whosTurn
        })
    }

    changeIdentity(suspectId){
        const location = this.getLocation(suspectId)
        let newSuspectList = this.state.suspects
        let newKillerIdentity

        //draw form the evidience deck
        if (this.state.evidenceDeck.length) {
            newKillerIdentity = this.state.evidenceDeck.splice(0, 1)
            // if they drew a dead person, thier turn is over
            // still need to update whos turn and persist changes to the evidence deck
            if (!newKillerIdentity[0].alive) {
                this.setState({
                    evidenceDeck: this.state.evidenceDeck,
                    whosTurn: this.DETECTIVE
                })
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
    }

    removeAlibiFromPlayer(suspectId){
        let alibiList = this.state.alibiList
        for (const [alibiIndex, alibi] of alibiList.entries()) {
            // check list for killed person's id
            if(alibi.id === suspectId) {
                // remove the alibi
                alibiList.splice(alibiIndex, 1)
                // add a card to the alibi list if there are some to choose from
                if (this.state.evidenceDeck.length) {
                    alibiList.push(this.state.evidenceDeck.splice(0, 1)[0])
                }
            }
        }

        this.setState({
            alibiList: alibiList
        })
    }

    render(){
        const suspects = this.state.suspects
        const killCount = this.state.killCount
        const evidenceDeck = this.state.evidenceDeck
        const modalState = this.state.modalState
        const alibiList = this.state.alibiList
        const secretIdentity = this.state.secretIdentity
        const playerSelect = this.state.playerSelect
        const killersIdentity = this.state.killersIdentity
        const arrestList = this.state.arrestList
        const whosTurn = this.state.whosTurn

        return (
            <Layout>
                <Head>
                    <title>Game Board</title>
                </Head>
                <Row className={`text-white`}>
                    <Col md={3}>
                        <Row>
                            <Col md={12} className={css.evidenceHeader}>
                                <h5 >Rules</h5>
                                <ol>
                                    <li>You may shift the board in any direction 1 time.</li>
                                    <li>You may reveal that 1 of the suspects has an alibi.</li>
                                    <li>You may try to make an arrest by selecting a tile adjacent to your current location.</li>
                                </ol>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md={12} className={css.evidenceHeader}>
                                <h5>Secret Identity</h5>
                                <div className={css.modalEvidenceContainer}>
                                    {secretIdentity.map((alibi, i) => {
                                        return (
                                            <SecretIdentity key={`secId-${i}`} id={alibi.id} name={alibi.name} alive={alibi.alive} image={alibi.image}></SecretIdentity>
                                        )
                                    })}
                                </div>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md={12} className={css.evidenceHeader}>
                                <h5 className={css.evidenceHeader}>Alibis</h5>
                                Remove dead alibis, and draw new card by clicking them. 
                            </Col>
                            <Col md={12}>
                                <div className={css.modalEvidenceContainer}>
                                    {alibiList.map((alibi, i) => {
                                        return (
                                            <Alibi 
                                            key={`alibi-${alibi.id}`}
                                            alibiSuspect={this.alibiSuspect}
                                            alibiIndex={i}
                                            susId={alibi.id}
                                            name={alibi.name}
                                            image={alibi.image}
                                            alive={alibi.alive}>
                                            </Alibi>
                                        )
                                    })}
                                </div>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md={12} className={css.evidenceHeader}>
                                <h5>Attempt Arrest</h5>
                                <Button variant="warning" onClick={this.arrestSuspect}>Select Suspect</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={6}>
                        <GameBoard 
                            suspects={suspects} 
                            handleClick={this.handleClick}
                        />
                    </Col>
                    <Col md={3}>
                        <Row>
                            <Col md={12} className={css.evidenceHeader}>
                                <h2 className={(whosTurn === 'Detective' ? css.txtBlue : css.txtRed)}>
                                    {whosTurn}'s Turn                      
                                </h2>
                                <h4>People Killed: {killCount}</h4>
                            </Col>
                        </Row>
                    </Col>
                </Row>

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

                <Modal show={this.state.lost} animation={false} backdrop="static" keyboard={false}>
                    <Modal.Header className={`${utilStyles.bg_darkGrey} text-white`}>
                        <Modal.Title>{(killCount === 6 ? 'You\'re off the case' : 'RIP')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={`${utilStyles.bg_darkGrey} text-white`}>
                        <p>
                            {(
                                killCount === 6 
                                ? `You let the killer get away with too many murders!`
                                : `You were killed by ${killersIdentity && killersIdentity[0] ? killersIdentity[0].name : 'the killer'}`)
                            }
                        </p>
                    </Modal.Body>
                    <Modal.Footer className={`${utilStyles.bg_darkGrey} text-white`}>
                        <Button variant='success' onClick={this.resetBoard}>Try Again?</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showArrestList} animation={false} keyboard={false} onHide={this.closeArrest}>
                    <Modal.Header closeButton className={`${utilStyles.bg_darkGrey} text-white`}>
                        <Modal.Title>Pick a person to arrest</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={`${utilStyles.bg_darkGrey} text-white`}>
                        <div className={css.evidenceHeader}>
                            {arrestList.map((alibi, i) => {
                                return (
                                    <Suspect key={`suspect-${i}`} id={alibi.id} makeArrest={this.makeArrest} selectIndex={i} name={alibi.name} image={alibi.image}></Suspect>
                                )
                            })}
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.won} animation={false} backdrop="static" keyboard={false}>
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
            </Layout>
        )
    }   
}
