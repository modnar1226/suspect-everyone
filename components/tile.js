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
     * @param {Function} [props.onTileClick] - Click handler for tile actions (arrest/kill)
     * @param {boolean} [props.clickable] - Whether tile should be clickable
     * @param {Function} [props.killSuspect] - Legacy click handler (deprecated)
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
        const { id, alive, alibied, alibiedImage, image, name, isPlayer, onTileClick, clickable, killSuspect } = this.props
        const displayImage = alibied ? alibiedImage : image
        const playerClass = isPlayer ? css.markPlayer : ''
        const alibiedClass = alibied ? css.alibied : ''
        
        // Handle click - prioritize new onTileClick over legacy killSuspect
        let handleClick = undefined
        if (onTileClick && clickable) {
            handleClick = () => onTileClick(this.props)
        } else if (killSuspect) {
            // Legacy support
            handleClick = () => killSuspect(id)
        }
        
        // Add cursor style for clickable tiles
        const clickableClass = (handleClick && alive) ? css.clickableTile : ''
        
        let killed = null
        if (!alive) {
            killed = <img key={`oId-${id}`} className={css.overlay} src={`/images/deadOverlay.png`} alt={name} />
        }
        
        return (
            <div 
                key={`tileId-${id}`} 
                id={name} 
                className={`${css.tileBody} ${playerClass} ${alibiedClass} ${clickableClass}`} 
                onClick={handleClick}
            >
                <img key={`imgId-${id}`} className={css.tileImg} src={displayImage} alt={name}/>
                {killed}
                {name}
            </div>
        )
    }
}