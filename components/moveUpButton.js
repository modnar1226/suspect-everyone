import React from 'react'
import css from './tile.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class MoveUpButton extends React.Component{
    constructor (props) {
        super(props)
    }

    render() {
        return (
            <div className={css.colBtn} onClick={() => this.props.handleClick(this.props.colIndex, this.props.direction)}>
                <FontAwesomeIcon icon='chevron-up' inverse transform="shrink-3" />
            </div>
        )
    }
}