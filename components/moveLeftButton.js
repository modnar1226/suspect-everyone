import React from 'react'
import css from './css/tile.module.css'

export default class MoveLeftButton extends React.Component{
    constructor (props) {
        super(props)
    }
    
    render() {
        const positionClass = css[`moveButtonLeft${this.props.index}`]
        return (
            <div className={`${css.moveButtonLeft} ${positionClass}`} onClick={() => this.props.handleClick(this.props.index, this.props.direction)}>
            </div>
        )
    }
}