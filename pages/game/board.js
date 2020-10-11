import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/layout'
import MoveUpButton from '../../components/moveUpButton'
import MoveDownButton from '../../components/moveDownButton'
import MoveLeftButton from '../../components/moveLeftButton'
import MoveRightButton from '../../components/moveRightButton'
import Tile from '../../components/tile'
import css from '../../components/tile.module.css'
import React from 'react'
import ReactDOM from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Suspects from '../../mappings/suspectList'


export default class GameBoard extends React.Component{
    constructor(props){
        super(props)
        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this)
        this.state = {
            matrix: Suspects
        }
        console.log(this.state)
    }
    componentDidMount() {}
    componentWillUnmount() {
        //this.setState({})
    }
    getMatrixCol(index){
        return this.state.matrix.map((row) => {
            return row[index];
        })
    }

    getMatrixRow(index) {
        return this.state.matrix[index]
    }

    shiftMatrix(toShift,dir){
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
            this.state.matrix[index] = this.shiftMatrix(this.getMatrixRow(index), direction)
        } else {
            // need to rebuild rows with new values in var index
            let newCols = this.shiftMatrix(this.getMatrixCol(index), direction)
            console.log(newCols)
            const oldMatrix = this.state.matrix
            this.state.matrix = []
            oldMatrix.forEach((row, i) => {
                console.log(newCols[i])
                row[index] = newCols[i]
                this.state.matrix.push(row) 
            })
            
        }
        this.setState({
            matrix: this.state.matrix
        })
    }

    render(){
        const matrix = this.state.matrix
        return (
            <Layout>
                <Head>
                    <title>Game Board</title>
                </Head>
                <div id={css.grid}>
                    <table id={css.Gameboard} align="center">
                        <tbody>
                            <tr>
                                <td></td>
                                <MoveUpButton handleClick={this.handleClick} direction='up' colIndex='0' />
                                <MoveUpButton handleClick={this.handleClick} direction='up' colIndex='1' />
                                <MoveUpButton handleClick={this.handleClick} direction='up' colIndex='2' />
                                <MoveUpButton handleClick={this.handleClick} direction='up' colIndex='3' />
                                <MoveUpButton handleClick={this.handleClick} direction='up' colIndex='4' />
                                
                            </tr>
                            {matrix.map((i, row) => {
                                return (
                                    <tr className={`boardRow`}>
                                        <MoveLeftButton key={`0-${row}`} handleClick={this.handleClick} direction='left' colIndex={row} />
                                        {i.map(function (suspect) {
                                            console.log()
                                            return (
                                                <td>
                                                    {<Tile key={suspect.id} name={suspect.name} alive={suspect.alive} image={suspect.image}></Tile>}
                                                </td>
                                            )
                                        })
                                        }
                                        <MoveRightButton key={`1-${row}`} handleClick={this.handleClick} direction='right' colIndex={row} />
                                    </tr>
                                )
                            })}
                            <tr>
                                <td></td>
                                <MoveDownButton handleClick={this.handleClick} direction='down' colIndex='0' />
                                <MoveDownButton handleClick={this.handleClick} direction='down' colIndex='1' />
                                <MoveDownButton handleClick={this.handleClick} direction='down' colIndex='2' />
                                <MoveDownButton handleClick={this.handleClick} direction='down' colIndex='3' />
                                <MoveDownButton handleClick={this.handleClick} direction='down' colIndex='4' />
                            </tr>
                        </tbody>
                    </table>
                </div>

            </Layout>
        )
    }
}