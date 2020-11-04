import React from 'react'
import css from './tile.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class MoveRightButton extends React.Component{
    constructor (props) {
        super(props)
    }

    render() {
        return (
            <div className={css.rowRightBtn} onClick={() => this.props.handleClick(this.props.index, this.props.direction)}>
                <FontAwesomeIcon icon='chevron-right' fixedWidth transform="grow-20"/>
            </div>
        )
    }
}