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
import suspects from '../../mappings/suspectList'

export default class GameBoard extends React.Component{
    constructor(props){
        super(props)
        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this)
        const suspects = this.shuffle(this.cloneSuspectArray(Suspects))
        //console.log(this.populateBoardArray(suspects))
        const evidenceDeck = this.shuffle(this.cloneSuspectArray(Suspects))
        this.state = {
            suspects: this.populateBoardArray(suspects),
            evidenceDeck: evidenceDeck,
            killCount: 0
        }
        
    }

    componentDidMount() {}
    componentWillUnmount() {}
    shuffle(array) {
        return array.sort(() => Math.random() - 0.5) 
    }
    populateBoardArray(susArray){
        const boardArray = []
        for (let index = 0; index < 5; index++) {
            boardArray[index] = susArray.splice(0, 5)
        }
        console.log(boardArray)
        return boardArray
    }

    cloneSuspectArray(susArray){
        return susArray.map(obj => Object.assign({}, obj))
    }

    getSuspectCol(index){
        return this.state.suspects.map((row) => {
            return row[index];
        })
    }

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

    handleClick(index, direction){
        if (direction === 'left' || direction === 'right') {
            this.state.suspects[index] = this.shiftSuspect(this.getSuspectRow(index), direction)
        } else {
            // need to rebuild rows with new values in var index
            let newCols = this.shiftSuspect(this.getSuspectCol(index), direction)
            const oldsuspects = this.state.suspects
            this.state.suspects = []
            oldsuspects.forEach((row, i) => {
                console.log(newCols[i])
                row[index] = newCols[i]
                this.state.suspects.push(row) 
            })
            
        }
        this.setState({
            suspects: this.state.suspects
        })
    }

    render(){
        const suspects = this.state.suspects
        const killCount = this.state.killCount
        const evidenceDeck = this.state.evidenceDeck
        //console.log(evidenceDeck)
        return (
            <Layout>
                <Head>
                    <title>Game Board</title>
                </Head>
                <div className={css.colLeft}>
                    <h3>
                        Welcome Detective. There is a killer on the loose and your goal is to catch them before they kill 5 people. To find them you may do 1 of 3 things each turn.
                    </h3>
                    <hr/>
                    <ol>
                        <li>You may shift the board in any direction 1 time.</li>
                        <li>You may reveal that 1 of the suspects has an alibi.</li>
                        <li>You may try to make an arrest by selecting a tile adjacent to your current location.</li>
                    </ol>
                    <hr/>
                    <div>
                        <h5 className={css.evidenceHeader}>Alibis</h5>
                        {evidenceDeck.slice(0, 3).map((alibi) => {
                            return (
                                <Evidence name={alibi.name} image={alibi.image}></Evidence>
                            )
                        })}
                    </div>
                    <hr/>
                    <div className={css.evidenceHeader}>
                        <h5>Attempt Arrest</h5>
                        <button className={`btn btn-warning`}>Select Suspect</button>
                    </div>
                </div>
                <div className={css.grid}>
                    <div className={css.boardRow}>
                        <div className={css.rowLeftBtn}></div>
                        <MoveUpButton handleClick={this.handleClick} direction='up' colIndex='0' />
                        <MoveUpButton handleClick={this.handleClick} direction='up' colIndex='1' />
                        <MoveUpButton handleClick={this.handleClick} direction='up' colIndex='2' />
                        <MoveUpButton handleClick={this.handleClick} direction='up' colIndex='3' />
                        <MoveUpButton handleClick={this.handleClick} direction='up' colIndex='4' />
                        <div className={css.rowLeftBtn}></div>
                    </div>
                    {suspects.map((i, row) => {
                        return (
                            <div key={`boardRow-${row}`} className={css.boardRow}>
                                <MoveLeftButton key={`0-${row}`} handleClick={this.handleClick} direction='left' colIndex={row} />
                                {i.map(function (suspect) {
                                    console.log()
                                    return (
                                        <Tile key={suspect.id} name={suspect.name} alive={suspect.alive} image={suspect.image}></Tile>
                                    )
                                })
                                }
                                <MoveRightButton key={`1-${row}`} handleClick={this.handleClick} direction='right' colIndex={row} />
                            </div>
                        )
                    })}
                    <div className={css.boardRow}>
                        <div className={css.rowLeftBtn}></div>
                        <MoveDownButton handleClick={this.handleClick} direction='down' colIndex='0' />
                        <MoveDownButton handleClick={this.handleClick} direction='down' colIndex='1' />
                        <MoveDownButton handleClick={this.handleClick} direction='down' colIndex='2' />
                        <MoveDownButton handleClick={this.handleClick} direction='down' colIndex='3' />
                        <MoveDownButton handleClick={this.handleClick} direction='down' colIndex='4' />
                        <div className={css.rowLeftBtn}></div>

                    </div>
                </div>
                <div className={css.colRight}>
                <h3>People Killed: {killCount}</h3>
                </div>
            </Layout>
        )
    }   
}
