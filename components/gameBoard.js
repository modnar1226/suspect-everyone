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
     * @param {Function} [props.onTileClick] - Callback function for tile clicks (arrest/kill)
     * @param {Function} [props.canClickTile] - Function to determine if tile is clickable
     * @memberof GameBoard
     */
    constructor(props) {
        super(props)
        this.state = {
            touchStart: null,
            touchEnd: null,
            isDragging: false,
            dragDirection: null,
            dragProgress: 0,
            targetRowCol: null // Track which row/column is being affected
        }
        this.handleTouchStart = this.handleTouchStart.bind(this)
        this.handleTouchMove = this.handleTouchMove.bind(this)
        this.handleTouchEnd = this.handleTouchEnd.bind(this)
        this.getRowColFromTouch = this.getRowColFromTouch.bind(this)
    }

    /**
     * Calculate which row/column is being touched based on position within the game board
     */
    getRowColFromTouch(e, boardElement) {
        const rect = boardElement.getBoundingClientRect()
        const x = e.targetTouches[0].clientX - rect.left
        const y = e.targetTouches[0].clientY - rect.top
        
        // Calculate the size of each cell including gaps
        const boardWidth = rect.width
        const boardHeight = rect.height
        const cellWidth = boardWidth / 7  // 7 columns
        const cellHeight = boardHeight / 7  // 7 rows
        
        // Calculate row and column (0-6, but we only care about the game area 1-5)
        const col = Math.floor(x / cellWidth)
        const row = Math.floor(y / cellHeight)
        
        // Convert to game coordinates (1-5 becomes 0-4)
        const gameCol = Math.max(0, Math.min(4, col - 1))
        const gameRow = Math.max(0, Math.min(4, row - 1))
        
        return { row: gameRow, col: gameCol }
    }

    handleTouchStart(e) {
        const boardElement = e.currentTarget
        const { row, col } = this.getRowColFromTouch(e, boardElement)
        
        this.setState({
            touchEnd: null,
            touchStart: {
                x: e.targetTouches[0].clientX,
                y: e.targetTouches[0].clientY
            },
            isDragging: false,
            dragDirection: null,
            dragProgress: 0,
            targetRowCol: { row, col }
        })
        
        // Store board element reference for later use
        this.boardElement = boardElement
    }

    handleTouchMove(e) {
        if (!this.state.touchStart) return
        
        const touchEnd = {
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        }
        
        const distanceX = this.state.touchStart.x - touchEnd.x
        const distanceY = this.state.touchStart.y - touchEnd.y
        const absDistanceX = Math.abs(distanceX)
        const absDistanceY = Math.abs(distanceY)
        
        // Determine if we're dragging and in which direction
        let dragDirection = null
        let dragProgress = 0
        let isDragging = false
        
        if (absDistanceX > 10 || absDistanceY > 10) {
            isDragging = true
            
            if (absDistanceX > absDistanceY) {
                // Horizontal swipe
                dragDirection = distanceX > 0 ? 'left' : 'right'
                dragProgress = Math.min(absDistanceX / 100, 1) // Max 1 square movement
            } else {
                // Vertical swipe
                dragDirection = distanceY > 0 ? 'up' : 'down'
                dragProgress = Math.min(absDistanceY / 100, 1) // Max 1 square movement
            }
        }
        
        this.setState({
            touchEnd,
            isDragging,
            dragDirection,
            dragProgress
        })
    }

    handleTouchEnd() {
        if (!this.state.touchStart || !this.state.touchEnd) {
            this.setState({
                isDragging: false,
                dragDirection: null,
                dragProgress: 0,
                targetRowCol: null
            })
            return
        }
        
        const { handleClick } = this.props
        const { touchStart, touchEnd } = this.state
        const distanceX = touchStart.x - touchEnd.x
        const distanceY = touchStart.y - touchEnd.y
        const isLeftSwipe = distanceX > 50
        const isRightSwipe = distanceX < -50
        const isUpSwipe = distanceY > 50
        const isDownSwipe = distanceY < -50

        // Determine which direction and which row/column based on touch position
        if (isLeftSwipe || isRightSwipe || isUpSwipe || isDownSwipe) {
            const { targetRowCol } = this.state
            
            if (targetRowCol && handleClick) {
                if (isLeftSwipe) {
                    handleClick(targetRowCol.row, 'left')
                } else if (isRightSwipe) {
                    handleClick(targetRowCol.row, 'right')
                } else if (isUpSwipe) {
                    handleClick(targetRowCol.col, 'up')
                } else if (isDownSwipe) {
                    handleClick(targetRowCol.col, 'down')
                }
            }
        }
        
        // Reset drag state
        this.setState({
            isDragging: false,
            dragDirection: null,
            dragProgress: 0,
            targetRowCol: null
        })
    }

    /**
     * Renders the complete game board with tiles and move buttons
     * @returns {JSX.Element} The game board JSX
     * @memberof GameBoard
     */
    render() {
        const { suspects, handleClick, onTileClick, canClickTile } = this.props
        const { isDragging, dragDirection, dragProgress } = this.state
        
        // Calculate transform for individual tiles based on drag
        const getTileTransform = (rowIndex, colIndex) => {
            if (!isDragging || !dragDirection || !this.state.targetRowCol) return ''
            
            const { targetRowCol } = this.state
            const maxOffset = 30 // Maximum pixels to shift (increased for better visibility)
            const offset = dragProgress * maxOffset
            
            // Check if this tile should be transformed
            const isInTargetRow = (dragDirection === 'left' || dragDirection === 'right') && rowIndex === targetRowCol.row
            const isInTargetCol = (dragDirection === 'up' || dragDirection === 'down') && colIndex === targetRowCol.col
            
            if (!isInTargetRow && !isInTargetCol) return ''
            
            switch (dragDirection) {
                case 'left':
                    return `translateX(-${offset}px)`
                case 'right':
                    return `translateX(${offset}px)`
                case 'up':
                    return `translateY(-${offset}px)`
                case 'down':
                    return `translateY(${offset}px)`
                default:
                    return ''
            }
        }

        // Check if we're on a touch device (move buttons are hidden anyway)
        const isTouchDevice = typeof window !== 'undefined' && 
                             ('ontouchstart' in window || navigator.maxTouchPoints > 0)

        // Calculate transform for row move buttons (left/right) - only on non-touch devices
        const getRowButtonTransform = (rowIndex) => {
            if (isTouchDevice) return '' // No button transforms on touch devices
            if (!isDragging || !this.state.targetRowCol) return ''
            if (dragDirection !== 'left' && dragDirection !== 'right') return ''
            if (rowIndex !== this.state.targetRowCol.row) return ''
            
            const maxOffset = 30
            const offset = dragProgress * maxOffset
            
            return dragDirection === 'left' ? `translateX(-${offset}px)` : `translateX(${offset}px)`
        }

        // Calculate transform for column move buttons (up/down) - only on non-touch devices
        const getColButtonTransform = (colIndex) => {
            if (isTouchDevice) return '' // No button transforms on touch devices
            if (!isDragging || !this.state.targetRowCol) return ''
            if (dragDirection !== 'up' && dragDirection !== 'down') return ''
            if (colIndex !== this.state.targetRowCol.col) return ''
            
            const maxOffset = 30
            const offset = dragProgress * maxOffset
            
            return dragDirection === 'up' ? `translateY(-${offset}px)` : `translateY(${offset}px)`
        }

        return (
            <div 
                className={css.gameBoard}
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}
                onTouchEnd={this.handleTouchEnd}
            >
                
                {/* Empty corner */}
                <div className={css.emptyCornerTL}></div>
                
                {/* Top move buttons */}
                {[0, 1, 2, 3, 4].map(colIndex => {
                    const buttonTransform = getColButtonTransform(colIndex)
                    const buttonStyle = buttonTransform ? {
                        transform: buttonTransform,
                        transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                    } : undefined
                    
                    return buttonStyle ? (
                        <div key={`top-${colIndex}`} style={buttonStyle}>
                            <MoveUpButton handleClick={handleClick} direction='up' index={colIndex.toString()} />
                        </div>
                    ) : (
                        <MoveUpButton key={`top-${colIndex}`} handleClick={handleClick} direction='up' index={colIndex.toString()} />
                    )
                })}
                
                {/* Empty corner */}
                <div className={css.emptyCornerTR}></div>

                {/* Game rows with left buttons, tiles, and right buttons */}
                {suspects.map((row, rowIndex) => (
                    <React.Fragment key={`boardRow-${rowIndex}`}>
                        {(() => {
                            const buttonTransform = getRowButtonTransform(rowIndex)
                            const buttonStyle = buttonTransform ? {
                                transform: buttonTransform,
                                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                            } : undefined
                            
                            return buttonStyle ? (
                                <div style={buttonStyle}>
                                    <MoveLeftButton handleClick={handleClick} direction='left' index={rowIndex} />
                                </div>
                            ) : (
                                <MoveLeftButton handleClick={handleClick} direction='left' index={rowIndex} />
                            )
                        })()}
                        {row.map((suspect, colIndex) => {
                            // Highlight the actual row/column being affected by drag
                            const { targetRowCol } = this.state
                            const isAffectedRow = isDragging && (dragDirection === 'left' || dragDirection === 'right') && 
                                                 targetRowCol && rowIndex === targetRowCol.row
                            const isAffectedCol = isDragging && (dragDirection === 'up' || dragDirection === 'down') && 
                                                 targetRowCol && colIndex === targetRowCol.col
                            const highlightClass = (isAffectedRow || isAffectedCol) ? css.dragHighlight : ''
                            
                            const tileTransform = getTileTransform(rowIndex, colIndex)
                            const tileStyle = tileTransform ? {
                                transform: tileTransform,
                                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                                zIndex: (isAffectedRow || isAffectedCol) ? 10 : 1
                            } : undefined

                            return (
                                <div 
                                    key={suspect.id} 
                                    className={`${css.gameTile} ${css[`gameTileRow${rowIndex}`]} ${css[`gameTileCol${colIndex}`]} ${highlightClass}`}
                                    style={tileStyle}
                                >
                                    <Tile
                                        id={suspect.id}
                                        name={suspect.name}
                                        alive={suspect.alive}
                                        image={suspect.image}
                                        alibiedImage={suspect.alibiedImage}
                                        alibied={suspect.alibied}
                                        isPlayer={suspect.isPlayer}
                                        onTileClick={onTileClick}
                                        clickable={canClickTile ? canClickTile(suspect) : false}
                                    />
                                </div>
                            )
                        })}
                        {(() => {
                            const buttonTransform = getRowButtonTransform(rowIndex)
                            const buttonStyle = buttonTransform ? {
                                transform: buttonTransform,
                                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                            } : undefined
                            
                            return buttonStyle ? (
                                <div style={buttonStyle}>
                                    <MoveRightButton handleClick={handleClick} direction='right' index={rowIndex} />
                                </div>
                            ) : (
                                <MoveRightButton handleClick={handleClick} direction='right' index={rowIndex} />
                            )
                        })()}
                    </React.Fragment>
                ))}

                {/* Empty corner */}
                <div className={css.emptyCornerBL}></div>
                
                {/* Bottom move buttons */}
                {[0, 1, 2, 3, 4].map(colIndex => {
                    const buttonTransform = getColButtonTransform(colIndex)
                    const buttonStyle = buttonTransform ? {
                        transform: buttonTransform,
                        transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                    } : undefined
                    
                    return buttonStyle ? (
                        <div key={`bottom-${colIndex}`} style={buttonStyle}>
                            <MoveDownButton handleClick={handleClick} direction='down' index={colIndex.toString()} />
                        </div>
                    ) : (
                        <MoveDownButton key={`bottom-${colIndex}`} handleClick={handleClick} direction='down' index={colIndex.toString()} />
                    )
                })}
                
                {/* Empty corner */}
                <div className={css.emptyCornerBR}></div>
            </div>
        )
    }
}