import React from 'react'
import css from './css/tile.module.css'

export default class MoveDownButton extends React.Component{
    constructor (props) {
        super(props)
    }

    render() {
        const positionClass = css[`moveButtonDown${this.props.index}`]
        return (
            <div className={`${css.moveButtonDown} ${positionClass}`} onClick={() => this.props.handleClick(this.props.index, this.props.direction)}>
            </div>
        )
    }
}