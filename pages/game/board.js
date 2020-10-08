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


export default class GameBoard extends React.Component{
    constructor(props){
        super(props)
        // This binding is necessary to make `this` work in the callback
        this.handleUpClick = this.handleUpClick.bind(this)
        this.state = {
            matrix: [
                [1, 2, 3, 4, 5],
                [6, 7, 8, 9, 10],
                [11, 12, 13, 14, 15],
                [16, 17, 18, 19, 20],
                [21, 22, 23, 24, 25]
            ]
        }
    }
    componentDidMount() {}
    componentWillUnmount() {
        //this.setState({})
    }

    handleUpClick(index){
        //e.preventDefault()
        //e.stopPropagation()
        //e.nativeEvent.stopImmediatePropagation()
        //console.log(e)
        // data-col-index
        //if (e.currentTarget.dataset.colIndex !== undefined) {
        //    console.log(e.target.dataset.colIndex)
        //} else {
        //    console.log(e.target.dataset.rowIndex)
        //}
        console.log('index: ' + index)
        this.setState({
            matrix: [
                [1, 2, 3, 4, 5],
                [6, 7, 8, 9, 10],
                [11, 12, 13, 14, 15],
                [16, 17, 18, 19, 20],
                [21, 22, 23, 24, 25]]
        });
    }

    render(){
        const matrix = this.state.matrix
        return (
            <Layout>
                <Head>
                    <title>Game Board</title>
                </Head>
                <div id={css.grid}>
                    <table align="center">
                        <tbody>
                            <tr>
                                <td></td>
                                <MoveUpButton handleClick={this.handleUpClick} colIndex='0' />
                                <MoveUpButton handleClick={this.handleUpClick} colIndex='1' />
                                <MoveUpButton handleClick={this.handleUpClick} colIndex='2' />
                                <MoveUpButton handleClick={this.handleUpClick} colIndex='3' />
                                <MoveUpButton handleClick={this.handleUpClick} colIndex='4' />
                                
                            </tr>
                            {matrix.map((i, row) => {
                                return (
                                    <tr className={`boardRow`}>
                                        <MoveLeftButton handleClick={this.handleUpClick} colIndex={row} />
                                        {i.map(function (index, col) {

                                            return (
                                                <td>
                                                    {<Tile key={`${index}`} name={index} alive={true} image={null}></Tile>}
                                                </td>
                                            )
                                        })
                                        }
                                        <MoveRightButton handleClick={this.handleUpClick} colIndex={row} />
                                    </tr>
                                )
                            })}
                            <tr>
                                <td></td>
                                <MoveDownButton handleClick={this.handleUpClick} colIndex='0' />
                                <MoveDownButton handleClick={this.handleUpClick} colIndex='1' />
                                <MoveDownButton handleClick={this.handleUpClick} colIndex='2' />
                                <MoveDownButton handleClick={this.handleUpClick} colIndex='3' />
                                <MoveDownButton handleClick={this.handleUpClick} colIndex='4' />
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Layout>
        )
    }
}