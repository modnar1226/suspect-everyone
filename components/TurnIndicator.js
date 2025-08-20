/**
 * TurnIndicator - Responsive turn indicator component
 * Shows current player's turn with visual indicators and loading state
 */

import React from 'react'
import css from './css/turnIndicator.module.css'

/**
 * @param {Object} props
 * @param {string} props.currentTurn - Current player's turn ('Detective' or 'Killer')
 * @param {number} props.killCount - Number of people killed
 * @param {boolean} [props.isProcessing] - Whether AI is processing turn
 * @param {string} [props.gameMode] - Game mode for styling ('detective' or 'killer')
 */
export default function TurnIndicator({ currentTurn, killCount, isProcessing = false, gameMode = 'detective' }) {
    const isDetectiveTurn = currentTurn === 'Detective'
    const isKillerTurn = currentTurn === 'Killer'
    
    // Determine styling based on turn and game mode
    const turnColorClass = isDetectiveTurn ? css.detectiveTurn : css.killerTurn
    const processingClass = isProcessing ? css.processing : ''
    
    return (
        <div className={`${css.turnIndicator} ${processingClass}`}>
            <div className={`${css.turnDisplay} ${turnColorClass}`}>
                <div className={css.turnTitle}>
                    <h2 className={css.turnText}>
                        {currentTurn}'s Turn
                    </h2>
                    {isProcessing && (
                        <div className={css.processingIndicator}>
                            <div className={css.spinner}></div>
                            <span className={css.processingText}>Processing...</span>
                        </div>
                    )}
                </div>
                
                <div className={css.gameStats}>
                    <div className={css.statItem}>
                        <span className={css.statLabel}>People Killed:</span>
                        <span className={css.statValue}>{killCount}</span>
                    </div>
                    
                    {/* Game mode specific indicators */}
                    {gameMode === 'detective' && (
                        <div className={css.objective}>
                            <span className={css.objectiveText}>
                                {isDetectiveTurn ? 'Find the killer!' : 'AI is planning...'}
                            </span>
                        </div>
                    )}
                    
                    {gameMode === 'killer' && (
                        <div className={css.objective}>
                            <span className={css.objectiveText}>
                                {isKillerTurn ? 'Eliminate suspects!' : 'Detective investigating...'}
                            </span>
                            <div className={css.killProgress}>
                                <div 
                                    className={css.progressBar}
                                    style={{ width: `${(killCount / 6) * 100}%` }}
                                ></div>
                                <span className={css.progressText}>{killCount}/6</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Turn lock overlay when processing */}
            {isProcessing && (
                <div className={css.lockOverlay}>
                    <div className={css.lockMessage}>
                        <i className={css.lockIcon}>🔒</i>
                        <span>Wait for {currentTurn === 'Killer' ? 'Killer' : 'Detective'} to finish</span>
                    </div>
                </div>
            )}
        </div>
    )
}