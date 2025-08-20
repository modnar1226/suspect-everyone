import React from 'react'
import MoveUpButton from './moveUpButton'
import MoveDownButton from './moveDownButton'
import MoveLeftButton from './moveLeftButton'
import MoveRightButton from './moveRightButton'
import Tile from './tile'
import css from './css/tile.module.css'

/**
 * GameBoard Component - Reusable 7x7 grid game board for Suspect Everyone
 * 
 * Renders a game board with:
 * - 5x5 grid of suspect tiles in the center
 * - Move buttons (chevrons) around the perimeter for shifting rows/columns
 * - Empty corners for proper alignment
 * - CSS Grid layout for precise positioning
 * 
 * @class GameBoard
 * @extends {React.Component}
 */
export default class GameBoard extends React.Component {
    /**
     * Creates an instance of GameBoard
     * @param {Object} props - Component properties
     * @param {Array} props.suspects - 2D array (5x5) of suspect objects
     * @param {Function} props.handleClick - Callback function for move button clicks
     * @memberof GameBoard
     */
    constructor(props) {
        super(props)
    }

    /**
     * Renders the complete game board with tiles and move buttons
     * @returns {JSX.Element} The game board JSX
     * @memberof GameBoard
     */
    render() {
        const { suspects, handleClick } = this.props

        return (
            <div className={css.gameBoard}>
                {/* Empty corner */}
                <div className={css.emptyCornerTL}></div>
                
                {/* Top move buttons */}
                <MoveUpButton handleClick={handleClick} direction='up' index='0' />
                <MoveUpButton handleClick={handleClick} direction='up' index='1' />
                <MoveUpButton handleClick={handleClick} direction='up' index='2' />
                <MoveUpButton handleClick={handleClick} direction='up' index='3' />
                <MoveUpButton handleClick={handleClick} direction='up' index='4' />
                
                {/* Empty corner */}
                <div className={css.emptyCornerTR}></div>

                {/* Game rows with left buttons, tiles, and right buttons */}
                {suspects.map((row, rowIndex) => (
                    <React.Fragment key={`boardRow-${rowIndex}`}>
                        <MoveLeftButton handleClick={handleClick} direction='left' index={rowIndex} />
                        {row.map((suspect, colIndex) => (
                            <div key={suspect.id} className={`${css.gameTile} ${css[`gameTileRow${rowIndex}`]} ${css[`gameTileCol${colIndex}`]}`}>
                                <Tile
                                    id={suspect.id}
                                    name={suspect.name}
                                    alive={suspect.alive}
                                    image={suspect.image}
                                    alibiedImage={suspect.alibiedImage}
                                    alibied={suspect.alibied}
                                    isPlayer={suspect.isPlayer}
                                />
                            </div>
                        ))}
                        <MoveRightButton handleClick={handleClick} direction='right' index={rowIndex} />
                    </React.Fragment>
                ))}

                {/* Empty corner */}
                <div className={css.emptyCornerBL}></div>
                
                {/* Bottom move buttons */}
                <MoveDownButton handleClick={handleClick} direction='down' index='0' />
                <MoveDownButton handleClick={handleClick} direction='down' index='1' />
                <MoveDownButton handleClick={handleClick} direction='down' index='2' />
                <MoveDownButton handleClick={handleClick} direction='down' index='3' />
                <MoveDownButton handleClick={handleClick} direction='down' index='4' />
                
                {/* Empty corner */}
                <div className={css.emptyCornerBR}></div>
            </div>
        )
    }
}