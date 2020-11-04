import React from 'react'
import css from './tile.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class MoveUpButton extends React.Component{
    constructor (props) {
        super(props)
    }

    render() {
        return (
            <div className={css.colBtn} onClick={() => this.props.handleClick(this.props.index, this.props.direction)}>
                <FontAwesomeIcon icon='chevron-up' transform="grow-20"/>
            </div>
        )
    }
}