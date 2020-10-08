import React from 'react'
import css from './tile.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class MoveUpButton extends React.Component{
    constructor (props) {
        super(props)
    }

    //handleClick = e =>{
    //    e.stopPropagation();  //  <------ Here is the magic
    //    return(this.colIndex)
    //}
    
    render() {
        return (
            <td onClick={() => this.props.handleClick(this.props.colIndex)}>
                <div className={css.moveColTop}><FontAwesomeIcon icon='chevron-up' inverse transform="shrink-6" /></div>
            </td>
        )
    }
}