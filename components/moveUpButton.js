import React from 'react'
import css from './css/tile.module.css'

export default class MoveUpButton extends React.Component{
    constructor (props) {
        super(props)
    }

    render() {
        const positionClass = css[`moveButtonUp${this.props.index}`]
        return (
            <div className={`${css.moveButtonUp} ${positionClass}`} onClick={() => this.props.handleClick(this.props.index, this.props.direction)}>
            </div>
        )
    }
}