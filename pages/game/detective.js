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
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export default class GameBoard extends React.Component{
    constructor(props){
        super(props)
        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this)
        this.handleShow = this.handleShow.bind(this)
        this.handleClose = this.handleClose.bind(this)
        
        const suspects = this.shuffle(this.cloneSuspectArray(Suspects))
        const evidenceDeck = this.shuffle(this.cloneSuspectArray(Suspects))
        const alibiList = evidenceDeck.splice(0, 4)
        const discardPile = []
        this.state = {
            suspects: this.populateBoardArray(suspects),
            evidenceDeck: evidenceDeck,
            killCount: 0,
            modalState: true,
            secretIdentity: [],
            alibiList: alibiList
        }
        this.setIdentity = this.setIdentity.bind(this)
    }

    componentDidMount() {
        
    }
    componentWillUnmount() {

    }

    shuffle(array) {
        return array.sort(() => Math.random() - 0.5) 
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

    setIdentity(index){
        this.handleClose();
        this.setState({
            secretIdentity: [this.state.alibiList[index]],
            alibiList: this.state.alibiList.splice(index,1)
        })
    }
    
    handleClick(index, direction){
        if (direction === 'left' || direction === 'right') {
            this.state.suspects[index] = this.shiftSuspect(this.getSuspectRow(index), direction)
        } else {
            // need to rebuild rows with new values in var index
            let newCols = this.shiftSuspect(this.getSuspectCol(index), direction)
            const oldsuspects = this.state.suspects
            this.state.suspects = []
            oldsuspects.forEach((row, i) => {
                row[index] = newCols[i]
                this.state.suspects.push(row) 
            })
            
        }
        this.setState({
            suspects: this.state.suspects
        })
    }

    handleShow() {
        this.setState({ modalState: !this.state.modalState })
    }
    handleClose(){
        this.setState({ modalState: !this.state.modalState })
    }

    render(){
        const suspects = this.state.suspects
        const killCount = this.state.killCount
        const evidenceDeck = this.state.evidenceDeck
        const modalState = this.state.modalState
        const alibiList = this.state.alibiList
        const secretIdentity = this.state.secretIdentity

        return (
            <Layout>
                <Head>
                    <title>Game Board</title>
                </Head>
                <div className={css.colLeft}>
                    <h4>
                        Welcome Detective. There is a killer on the loose and your goal is to catch them before they kill 5 people. To find them you may do 1 of 3 things each turn.
                    </h4>
                    <hr/>
                    <ol>
                        <li>You may shift the board in any direction 1 time.</li>
                        <li>You may reveal that 1 of the suspects has an alibi.</li>
                        <li>You may try to make an arrest by selecting a tile adjacent to your current location.</li>
                    </ol>
                    <hr/>
                    <div className={css.evidenceHeader}>
                        <h5 className={css.evidenceHeader}>Secret Identity</h5>
                        {secretIdentity.map((alibi, i) => {
                            return (
                                <Evidence setIdentity={this.setIdentity} index={i} name={alibi.name} image={alibi.image}></Evidence>
                            )
                        })}
                    </div>
                    <hr />
                    <div>
                        <h5 className={css.evidenceHeader}>Alibis</h5>
                    </div>
                    <hr/>
                    <div className={css.evidenceHeader}>
                        <h5>Attempt Arrest</h5>
                        <button className={`btn btn-warning`}>Select Suspect</button>
                    </div>
                </div>
                <div className={css.grid}>
                    <Row className={css.boardRow}>
                        <div className={css.rowLeftBtn}></div>
                        <MoveUpButton handleClick={this.handleClick} direction='up' colIndex='0' />
                        <MoveUpButton handleClick={this.handleClick} direction='up' colIndex='1' />
                        <MoveUpButton handleClick={this.handleClick} direction='up' colIndex='2' />
                        <MoveUpButton handleClick={this.handleClick} direction='up' colIndex='3' />
                        <MoveUpButton handleClick={this.handleClick} direction='up' colIndex='4' />
                        <div className={css.rowLeftBtn}></div>
                    </Row>
                    {suspects.map((i, row) => {
                        return (
                            <Row key={`boardRow-${row}`} className={css.boardRow}>
                                <MoveLeftButton key={`0-${row}`} handleClick={this.handleClick} direction='left' colIndex={row} />
                                {i.map(function (suspect) {
                                    return (
                                        <Tile key={suspect.id} name={suspect.name} alive={suspect.alive} image={suspect.image}></Tile>
                                    )
                                })
                                }
                                <MoveRightButton key={`1-${row}`} handleClick={this.handleClick} direction='right' colIndex={row} />
                            </Row>
                        )
                    })}
                    <Row className={css.boardRow}>
                        <div className={css.rowLeftBtn}></div>
                        <MoveDownButton handleClick={this.handleClick} direction='down' colIndex='0' />
                        <MoveDownButton handleClick={this.handleClick} direction='down' colIndex='1' />
                        <MoveDownButton handleClick={this.handleClick} direction='down' colIndex='2' />
                        <MoveDownButton handleClick={this.handleClick} direction='down' colIndex='3' />
                        <MoveDownButton handleClick={this.handleClick} direction='down' colIndex='4' />
                        <div className={css.rowLeftBtn}></div>

                    </Row>
                </div>
                <div className={css.colRight}>
                    <h4>People Killed: {killCount}</h4>
                </div>
                <Modal show={modalState} onHide={this.handleClose} animation={false} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>Select your secret identity</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            {alibiList.map((alibi, i) => {
                                return (
                                    <Evidence setIdentity={this.setIdentity} index={i} name={alibi.name} image={alibi.image}></Evidence>
                                )
                            })}
                        </div>
                    </Modal.Body>
                </Modal>
            </Layout>
        )
    }   
}
