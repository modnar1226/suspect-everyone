import React from 'react'
import css from './tile.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class MoveRightButton extends React.Component{
    constructor (props) {
        super(props)
    }

    render() {
        return (
            <td onClick={() => this.props.handleClick(this.props.colIndex, this.props.direction)}>
                <div className={css.moveRow}><FontAwesomeIcon icon='chevron-right' size="xs" inverse transform="shrink-7" /></div>
            </td>
        )
    }
}