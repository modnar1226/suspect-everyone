import React from 'react'
import css from './css/tile.module.css'

/**
 * Tile Component - Individual suspect tile for the game board
 * 
 * Displays a suspect with their image, name, and various states:
 * - Normal/alibied image display
 * - Dead overlay when killed
 * - Player highlighting when it's the user's character
 * - Click handler for killer mode interactions
 * 
 * @class Tile
 * @extends {React.Component}
 */
export default class Tile extends React.Component{
    /**
     * Creates an instance of Tile
     * @param {Object} props - Component properties
     * @param {number} props.id - Unique suspect ID
     * @param {boolean} props.alive - Whether suspect is alive
     * @param {string} props.image - Default suspect image URL
     * @param {string} props.alibiedImage - Alternative image when alibied
     * @param {boolean} props.alibied - Whether suspect has an alibi
     * @param {string} props.name - Suspect's name
     * @param {boolean} props.isPlayer - Whether this is the player's character
     * @param {Function} [props.killSuspect] - Optional click handler for killer mode
     * @memberof Tile
     */
    constructor (props) {
        super(props)
    }

    /**
     * Renders the suspect tile with image, name, and overlays
     * @returns {JSX.Element} The suspect tile JSX
     * @memberof Tile
     */
    render() {
        const id = this.props.id
        const alive = this.props.alive
        let image = (this.props.alibied ? this.props.alibiedImage : this.props.image)
        const name = this.props.name
        const isPlayer = (this.props.isPlayer ? css.markPlayer : '')
        const canClick = this.props.killSuspect !== undefined ? () => this.props.killSuspect(id) : undefined
        let killed = null
        if (!alive) {
            killed = <img key={`oId-${id}`} className={`${css.overlay}`} src={`/images/deadOverlay.png`} alt={name} />
        }
        return (
        <div key={`tileId-${id}`} id={name} className={`${css.tileBody} ${isPlayer}`} onClick={canClick}>
            <img key={`imgId-${id}`} className={css.tileImg} src={image} alt={name}/>
            {killed}
            {name}
        </div>
        )
    }
}