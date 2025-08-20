import React from 'react'
import css from './css/tile.module.css'

export default class MoveRightButton extends React.Component{
    constructor (props) {
        super(props)
    }

    render() {
        const positionClass = css[`moveButtonRight${this.props.index}`]
        return (
            <div className={`${css.moveButtonRight} ${positionClass}`} onClick={() => this.props.handleClick(this.props.index, this.props.direction)}>
            </div>
        )
    }
}