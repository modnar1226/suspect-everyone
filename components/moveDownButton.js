import React from 'react'
import css from './css/tile.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class MoveDownButton extends React.Component{
    constructor (props) {
        super(props)
    }

    render() {
        return (
            <div className={css.colBtn} onClick={() => this.props.handleClick(this.props.index, this.props.direction)}>
                <FontAwesomeIcon icon='chevron-down' transform="grow-20"/>
            </div>
        )
    }
}