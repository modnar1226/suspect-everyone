import React from 'react'
import css from './css/tile.module.css'

/**
 * Evidence Component - Selectable character card for player identity selection
 * 
 * Used in modals and selection areas where players choose their secret identity.
 * Displays a circular character portrait with name underneath.
 * 
 * @class Evidence
 * @extends {React.Component}
 */
export default class Evidence extends React.Component{
    /**
     * Creates an instance of Evidence
     * @param {Object} props - Component properties
     * @param {number} props.id - Character ID
     * @param {boolean} props.alive - Whether character is alive
     * @param {string} props.image - Character image URL
     * @param {string} props.name - Character name
     * @param {Function} props.setIdentity - Callback when character is selected
     * @param {number} props.selectIndex - Index for selection callback
     * @memberof Evidence
     */
    constructor (props) {
        super(props)
    }

    /**
     * Renders the selectable character card
     * @returns {JSX.Element} The evidence card JSX
     * @memberof Evidence
     */
    render() {
        const id = this.props.id
        const alive = this.props.alive
        const image = this.props.image
        const name = this.props.name
        return (
            <div key={`e-${id}`} id={name} className={css.evidenceBody} onClick={() => this.props.setIdentity(this.props.selectIndex)}>
                <img key={`i-${id}`} className={css.evidenceImg} src={image} alt='image'/>
                <span>{name}</span>
            </div>
        )
    }
}