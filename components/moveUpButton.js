import React from 'react'
import css from './css/tile.module.css'

/**
 * MoveUpButton Component - Upward chevron button for shifting board columns up
 * 
 * Renders a CSS arrow pointing up that moves suspects in a column upward when clicked.
 * The top suspect moves to the bottom of the column.
 * 
 * @class MoveUpButton
 * @extends {React.Component}
 */
export default class MoveUpButton extends React.Component{
    /**
     * Creates an instance of MoveUpButton
     * @param {Object} props - Component properties
     * @param {Function} props.handleClick - Click handler function
     * @param {string} props.direction - Movement direction ('up')
     * @param {string|number} props.index - Column index (0-4)
     * @memberof MoveUpButton
     */
    constructor (props) {
        super(props)
    }

    /**
     * Renders the up arrow button with proper CSS Grid positioning
     * @returns {JSX.Element} The up arrow button JSX
     * @memberof MoveUpButton
     */
    render() {
        const positionClass = css[`moveButtonUp${this.props.index}`]
        return (
            <div className={`${css.moveButtonUp} ${positionClass}`} onClick={() => this.props.handleClick(this.props.index, this.props.direction)}>
            </div>
        )
    }
}