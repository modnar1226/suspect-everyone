import React from 'react'
import css from './tile.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class MoveLeftButton extends React.Component{
    constructor (props) {
        super(props)
    }
    
    render() {
        return (
            <div className={css.rowLeftBtn} onClick={() => this.props.handleClick(this.props.index, this.props.direction)}>
                <FontAwesomeIcon icon='chevron-left' fixedWidth transform="grow-20"/>
            </div>
        )
    }
}