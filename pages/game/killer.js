/**
 * Original game created by Maureen Birdsall and husband Mike
 * React version of game created by Ian Greene Nov 2020 
 */

import Head from 'next/head'
import Layout from '../../components/layout'
import MoveUpButton from '../../components/moveUpButton'
import MoveDownButton from '../../components/moveDownButton'
import MoveLeftButton from '../../components/moveLeftButton'
import MoveRightButton from '../../components/moveRightButton'
import Tile from '../../components/tile'
import Evidence from '../../components/evidence'
import css from '../../components/tile.module.css'
import React from 'react'
import Suspects from '../../mappings/suspectList'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Alibi from '../../components/alibi'
import Suspect from '../../components/suspect'

export default class GameBoard extends React.Component {
    constructor(props) {
        super(props)
        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this)
        this.handleShow = this.handleShow.bind(this)
        this.handleClose = this.handleClose.bind(this)
        //this.alibiSuspect = this.alibiSuspect.bind(this)
        //this.arrestSuspect = this.arrestSuspect.bind(this)
        //this.makeArrest = this.makeArrest.bind(this)
        this.resetBoard = this.resetBoard.bind(this)
        this.closeArrest = this.closeArrest.bind(this)
        this.changeIdentity = this.changeIdentity.bind(this)
        this.killSuspect = this.killSuspect.bind(this)
        this.suspectList = Suspects

        this.KILLER = 'Killer'
        this.DETECTIVE = 'Detective'
        const suspects = this.shuffle(this.cloneSuspectArray(this.suspectList))
        const evidenceDeck = this.shuffle(this.cloneSuspectArray(this.suspectList))
        //const discardPile = []
        this.state = this.newBoard()
        //this.setIdentity = this.setIdentity.bind(this)
    }

    newBoard() {
        const suspects = this.shuffle(this.cloneSuspectArray(this.suspectList))
        const evidenceDeck = this.shuffle(this.cloneSuspectArray(this.suspectList))
        const killerSelect = evidenceDeck.splice(0, 1)
        const playerSelect = this.shuffle(evidenceDeck.splice(0, 4))
        //const discardPile = []
        return {
            suspects: this.populateBoardArray(suspects),
            evidenceDeck: evidenceDeck,
            killCount: 0,
            modalState: true,
            killersIdentity: killerSelect,
            detectiveIdentity: playerSelect.splice(0,1),
            alibiList: playerSelect,
            won: false,
            lost: false,
            showArrestList: false,
            arrestList: [],
            whosTurn: this.KILLER
        }
    }

    resetBoard() {
        this.setState(
            this.newBoard()
        )
    }

    toggleTurnTxt(newValue) {
        this.setState({
            whosTurn: newValue
        })
    }
    
    /*
     * 
     * @param {Integer} personId The suspect id to find
     * @returns {Array} [rowIndex, colIndex] coordinates of the Suspect personId
     * 
     */
    getLocation(personId) {
        let rowIndex = null;
        let colIndex = null;

        for (const [index, row] of this.state.suspects.entries()) {
            for (const [cIndex, suspect] of row.entries()) {
                if (suspect.id === personId) {
                    rowIndex = index
                    colIndex = cIndex
                    break
                }
            }
        }

        return [rowIndex, colIndex]
    }

    getAdjacent(location, getPlayer = false) {
        const rowIndex = location[0]
        const colIndex = location[1]

        const rowMinus = rowIndex - 1
        const rowPlus = rowIndex + 1
        const colMinus = colIndex - 1
        const colPlus = colIndex + 1

        let adjacent = [
            // top row
            [rowMinus, colMinus], [rowMinus, colIndex], [rowMinus, colPlus],
            // mid row
            [rowIndex, colMinus],     /* person's location */[rowIndex, colPlus],
            // bot row
            [rowPlus, colMinus], [rowPlus, colIndex], [rowPlus, colPlus]
        ]
        if (getPlayer) {
            adjacent.splice(4, 0, [rowIndex, colIndex])
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
        return array.sort(() => Math.random() - 0.5)
    }

    populateBoardArray(susArray) {
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

    cloneSuspectArray(susArray) {
        return susArray.map(obj => Object.assign({}, obj))
    }

    /*
    killersTurn() {
        this.toggleTurnTxt(this.KILLER)
        const randomTime = Math.floor(Math.random() * 1500) + 500
        const moveOptions = [
            ['up', 0], ['up', 1], ['up', 2], ['up', 3], ['up', 4],
            ['down', 0], ['down', 1], ['down', 2], ['down', 3], ['down', 4],
            ['left', 0], ['left', 1], ['left', 2], ['left', 3], ['left', 4],
            ['right', 0], ['right', 1], ['right', 2], ['right', 3], ['right', 4]
        ]
        setTimeout(() => {
            const location = this.getLocation(this.state.killersIdentity[0].id)
            const availableKills = this.getAdjacent(location)
            const randLocation = availableKills[Math.floor(Math.random() * availableKills.length)]
            const moveButton = moveOptions[Math.floor(Math.random() * moveOptions.length)]
            let availableMoves = [
                () => { this.changeIdentity(this.state.killersIdentity[0].id) },
                () => { this.moveBoard(moveButton[1], moveButton[0], this.DETECTIVE) },
            ]
            if (randLocation !== undefined) {
                availableMoves.push(() => { this.killSuspect(randLocation) })
                availableMoves.push(() => { this.killSuspect(randLocation) })
            }
            // execute the move
            const options = this.shuffle(availableMoves)
            options[Math.floor(Math.random() * options.length)]()
        }, randomTime)
    }
    */

    killSuspect(suspectId) {
        const location = this.getLocation(suspectId)
        let newSuspectList = this.state.suspects
        newSuspectList[location[0]][location[1]].alive = false
        const killCount = this.state.killCount + 1
        if (newSuspectList[location[0]][location[1]].id === this.state.detectiveIdentity[0].id || killCount === 6) {
            this.setState({
                killCount: killCount,
                won: true,
            })
        } else {
            // condtional on whether the suspect was killed
            this.removeAlibiFromPlayer(newSuspectList[location[0]][location[1]].id)
            this.setState({
                suspects: newSuspectList,
                killCount: killCount,
                whosTurn: this.DETECTIVE
            })
        }
    }

    getSuspectCol(index) {
        return this.state.suspects.map((row) => {
            return row[index];
        })
    }

    // returns the array of suspects at 'index'
    getSuspectRow(index) {
        return this.state.suspects[index]
    }

    shiftSuspect(toShift, dir) {
        switch (dir) {
            case 'up':
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
     setIdentity(index) {
         this.handleClose();
         const detectiveIdentity = this.state.playerSelect[index]
         this.state.playerSelect.splice(index, 1)
         this.setState({
             detectiveIdentity: [detectiveIdentity],
             alibiList: this.state.playerSelect,
             playerSelect: []
            })
        }
    **/

    handleClick(index, direction) {
        this.moveBoard(index, direction, this.KILLER)
        this.killersTurn()
    }

    handleShow() {
        this.setState({ modalState: !this.state.modalState })
    }
    handleClose() {
        this.setState({ modalState: !this.state.modalState })
    }

    closeArrest() {
        this.setState({ showArrestList: !this.state.showArrestList })
    }

    /*
    alibiSuspect(alibiIndex, suspectId) {
        const location = this.getLocation(suspectId)
        let newSuspectList = this.state.suspects
        let alibiList = this.state.alibiList
        alibiList.splice(alibiIndex, 1)

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
    }*/

    /*
    arrestSuspect() {
        const location = this.getLocation(this.state.detectiveIdentity[0].id)
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
    
    makeArrest(suspectId) {
        const location = this.getLocation(suspectId)
        let won = false
        if (this.state.suspects[location[0]][location[1]].id === this.state.killersIdentity[0].id) {
            won = !this.state.won
        } else {
            this.killersTurn()
        }
        this.setState({
            showArrestList: !this.state.showArrestList,
            won: won,
            arrestList: []
        })
    }
    */

    moveBoard(index, direction, whosTurn) {
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

    changeIdentity() {
        const location = this.getLocation(this.state.killersIdentity[0].id)
        let newSuspectList = this.state.suspects
        let newKillerIdentity

        //draw form the evidience deck
        if (this.state.evidenceDeck.length) {
            newKillerIdentity = this.state.evidenceDeck.splice(0, 1)
        }
        newSuspectList[location[0]][location[1]].alibied = true
        this.setState({
            suspects: newSuspectList,
            evidenceDeck: this.state.evidenceDeck,
            killersIdentity: newKillerIdentity,
            whosTurn: this.DETECTIVE
        })
    }

    removeAlibiFromPlayer(suspectId) {
        let alibiList = this.state.alibiList
        for (const [alibiIndex, alibi] of alibiList.entries()) {
            // check list for killed person's id
            if (alibi.id === suspectId) {
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

    render() {
        const suspects = this.state.suspects
        const killCount = this.state.killCount
        const evidenceDeck = this.state.evidenceDeck
        const modalState = this.state.modalState
        const alibiList = this.state.alibiList
        const detectiveIdentity = this.state.detectiveIdentity
        const killersIdentity = this.state.killersIdentity
        const arrestList = this.state.arrestList
        const whosTurn = this.state.whosTurn

        return (
            <Layout>
                <Head>
                    <title>Game Board</title>
                </Head>
                <Row>
                    <Col md={2}>
                        <h4>Per turn you may:</h4>
                        <ol>
                            <li>You may shift the board in any direction 1 time.</li>
                            <li>You may change your alias 1.</li>
                            <li>You may try to make an arrest by selecting a tile adjacent to your current location.</li>
                        </ol>
                        <hr />
                        <div className={css.evidenceHeader}>
                            <h5 >Secret Identity</h5>
                            {killersIdentity.map((alibi, i) => {
                                return (
                                    <Tile key={`secId-${i}`} id={alibi.id} name={alibi.name} alive={alibi.alive} image={alibi.image}></Tile>
                                )
                            })}
                        </div>
                        <hr />
                        <div className={css.evidenceHeader}>
                            <h5>Use a disguise</h5>
                            <Button variant="warning" onClick={this.changeIdentity}>Change</Button>
                        </div>
                    </Col>
                    <Col md={8}>
                        <Row className="justify-content-md-center">
                            <div className={css.spacer}></div>
                            <MoveUpButton handleClick={this.handleClick} direction='up' index='0' />
                            <MoveUpButton handleClick={this.handleClick} direction='up' index='1' />
                            <MoveUpButton handleClick={this.handleClick} direction='up' index='2' />
                            <MoveUpButton handleClick={this.handleClick} direction='up' index='3' />
                            <MoveUpButton handleClick={this.handleClick} direction='up' index='4' />
                        </Row>
                        {suspects.map((row, rowIndex) => {
                            return (
                                <Row key={`boardRow-${rowIndex}`} className="justify-content-md-center">
                                    <MoveLeftButton key={`0-${rowIndex}`} handleClick={this.handleClick} direction='left' index={rowIndex} />
                                    {row.map((suspect) => {
                                        return (
                                            <Tile
                                                key={suspect.id}
                                                id={suspect.id}
                                                name={suspect.name}
                                                alive={suspect.alive}
                                                image={suspect.image}
                                                alibiedImage={suspect.alibiedImage}
                                                alibied={suspect.alibied}
                                                isPlayer={suspect.isPlayer}
                                                killSuspect = {this.killSuspect}
                                            ></Tile>
                                        )
                                    })
                                    }
                                    <MoveRightButton key={`1-${rowIndex}`} handleClick={this.handleClick} direction='right' index={rowIndex} />
                                </Row>
                            )
                        })}
                        <Row className="justify-content-md-center">
                            <div className={css.spacer}></div>
                            <MoveDownButton handleClick={this.handleClick} direction='down' index='0' />
                            <MoveDownButton handleClick={this.handleClick} direction='down' index='1' />
                            <MoveDownButton handleClick={this.handleClick} direction='down' index='2' />
                            <MoveDownButton handleClick={this.handleClick} direction='down' index='3' />
                            <MoveDownButton handleClick={this.handleClick} direction='down' index='4' />
                        </Row>
                    </Col>
                    <Col md={2}>
                        <h2 className={(whosTurn === 'Detective' ? css.txtBlue : css.txtRed)}>
                            {whosTurn}'s Turn
                        </h2>
                        <h4>People Killed: {killCount}</h4>
                    </Col>
                </Row>

                <Modal show={modalState} onHide={this.handleClose} animation={false} backdrop="static" keyboard={false}>
                    <Modal.Header dialogclassname={`justify-content: center`}>
                        <Modal.Title>
                            There's a Murdrer on the loose!
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h1 className='text-center'>
                            And it's <b>YOU</b> {killersIdentity[0].name}
                        </h1>
                        <p className={css.evidenceHeader}>
                            You feel the urge rise in you after years in hiding.
                            Your bloodlust won't end until you <b className={css.textRed}>murder 6 people</b>, then you can move on to the next town.
                            Beware though! The detectives In these parts are like bloodhounds.
                        </p>
                        <hr />
                        <div className={css.evidenceHeader}>
                            {killersIdentity.map((alibi, i) => {
                                return (
                                    <Tile key={`secId-${i}-start`} id={alibi.id} name={alibi.name} alive={alibi.alive} image={alibi.image}></Tile>
                                )
                            })}
                        </div>
                        <Button onClick={this.handleClose}>Start</Button>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.lost} animation={false} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>{(killCount === 6 ? 'You\'re off the case' : 'RIP')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            {(
                                killCount === 6
                                    ? `You let the killer get away with too many murders!`
                                    : `You were killed by ${killersIdentity[0].name}`)
                            }
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='success' onClick={this.resetBoard}>Try Again?</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showArrestList} animation={false} keyboard={false} onHide={this.closeArrest}>
                    <Modal.Header closeButton>
                        <Modal.Title>Pick a person to arrest</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
                    <Modal.Header dialogclassname={`justify-content: center`}>
                        <Modal.Title>Congratulations</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={css.evidenceHeader}>
                            You have killed the lead detecive, time to skip town!
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='success' onClick={this.resetBoard}>Play Again?</Button>
                    </Modal.Footer>
                </Modal>
            </Layout>
        )
    }
}
