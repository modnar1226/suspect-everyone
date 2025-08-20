/**
 * RulesModal - Comprehensive rules explanation component
 * Can show all rules or specific game mode rules
 */

import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import utilStyles from '../styles/utils.module.css'
import css from './css/rulesModal.module.css'

/**
 * @param {Object} props
 * @param {boolean} props.show - Whether modal is visible
 * @param {Function} props.onHide - Callback to hide modal
 * @param {string} [props.mode] - Specific mode to show ('detective', 'killer', or 'all')
 * @param {boolean} [props.showModeSelector] - Whether to show mode selection tabs
 */
export default function RulesModal({ show, onHide, mode = 'all', showModeSelector = true }) {
    const [selectedMode, setSelectedMode] = React.useState(mode)

    React.useEffect(() => {
        setSelectedMode(mode)
    }, [mode])

    const handleModeChange = (newMode) => {
        setSelectedMode(newMode)
    }

    const renderGameOverview = () => (
        <div className={css.rulesSection}>
            <h4 className={css.sectionTitle}>🎯 Game Overview</h4>
            <p className={css.description}>
                <strong>Suspect Everyone</strong> is a strategic deduction game where you must either catch the killer 
                or eliminate all witnesses. The game features a 5x5 grid of suspects that can be moved and manipulated 
                to create opportunities.
            </p>
            
            <div className={css.keyPoints}>
                <div className={css.keyPoint}>
                    <strong>🕵️ Detective Mode:</strong> Find and arrest the killer before they eliminate you or 6 people
                </div>
                <div className={css.keyPoint}>
                    <strong>🔪 Killer Mode:</strong> Eliminate 6 people or kill the detective without being caught
                </div>
                <div className={css.keyPoint}>
                    <strong>🎮 Interactive Board:</strong> Shift rows and columns to position suspects strategically
                </div>
            </div>
        </div>
    )

    const renderDetectiveRules = () => (
        <div className={css.rulesSection}>
            <h4 className={css.sectionTitle}>🕵️ Detective Rules</h4>
            
            <div className={css.objective}>
                <h5>Objective</h5>
                <p>Find and arrest the killer before they eliminate you or kill 6 people total.</p>
            </div>

            <div className={css.turnActions}>
                <h5>Per Turn You May:</h5>
                <ol className={css.actionList}>
                    <li><strong>Shift the board</strong> in any direction 1 time</li>
                    <li><strong>Reveal an alibi</strong> by clicking on one of your alibi cards</li>
                    <li><strong>Attempt an arrest</strong> by clicking on an adjacent suspect</li>
                </ol>
            </div>

            <div className={css.gameplayTips}>
                <h5>🔍 Detective Tips</h5>
                <ul className={css.tipsList}>
                    <li>Use alibis strategically - they protect suspects from being killed</li>
                    <li>Move the board to position yourself next to suspected killers</li>
                    <li>Pay attention to elimination patterns to deduce the killer's identity</li>
                    <li>You can only arrest suspects adjacent to your current position</li>
                    <li>If you arrest the wrong person, the killer gets another turn</li>
                </ul>
            </div>

            <div className={css.winConditions}>
                <h5>🏆 Win Conditions</h5>
                <div className={css.condition}>
                    <strong>Victory:</strong> Successfully arrest the killer
                </div>
                <div className={css.condition}>
                    <strong>Defeat:</strong> You are killed by the killer OR 6+ people are eliminated
                </div>
            </div>
        </div>
    )

    const renderKillerRules = () => (
        <div className={css.rulesSection}>
            <h4 className={css.sectionTitle}>🔪 Killer Rules</h4>
            
            <div className={css.objective}>
                <h5>Objective</h5>
                <p>Eliminate 6 people or kill the detective without being caught.</p>
            </div>

            <div className={css.turnActions}>
                <h5>Per Turn You May:</h5>
                <ol className={css.actionList}>
                    <li><strong>Shift the board</strong> in any direction 1 time</li>
                    <li><strong>Change your identity</strong> to a new suspect (draws from evidence deck)</li>
                    <li><strong>Eliminate a suspect</strong> by clicking on an adjacent target</li>
                </ol>
            </div>

            <div className={css.gameplayTips}>
                <h5>🗡️ Killer Tips</h5>
                <ul className={css.tipsList}>
                    <li>Changing identity leaves an alibi on your old location</li>
                    <li>Plan your kills carefully - the detective is watching patterns</li>
                    <li>Use board movement to escape detection and reach new targets</li>
                    <li>You can only kill suspects adjacent to your current position</li>
                    <li>Avoid predictable patterns that might reveal your identity</li>
                </ul>
            </div>

            <div className={css.winConditions}>
                <h5>🏆 Win Conditions</h5>
                <div className={css.condition}>
                    <strong>Victory:</strong> Kill the detective OR eliminate 6 total people
                </div>
                <div className={css.condition}>
                    <strong>Defeat:</strong> You are arrested by the detective
                </div>
            </div>
        </div>
    )

    const renderControlsGuide = () => (
        <div className={css.rulesSection}>
            <h4 className={css.sectionTitle}>🎮 Controls & Interface</h4>
            
            <Row>
                <Col md={6}>
                    <div className={css.controlGroup}>
                        <h5>💻 Desktop Controls</h5>
                        <ul className={css.controlsList}>
                            <li><strong>Arrow Buttons:</strong> Click arrows around the board to shift rows/columns</li>
                            <li><strong>Tile Clicks:</strong> Click on adjacent suspects to arrest/kill</li>
                            <li><strong>Alibi Cards:</strong> Click to reveal alibis (Detective mode)</li>
                            <li><strong>Change Button:</strong> Switch killer identity (Killer mode)</li>
                        </ul>
                    </div>
                </Col>
                <Col md={6}>
                    <div className={css.controlGroup}>
                        <h5>📱 Mobile Controls</h5>
                        <ul className={css.controlsList}>
                            <li><strong>Swipe Gestures:</strong> Swipe on board to shift in that direction</li>
                            <li><strong>Tap Tiles:</strong> Tap adjacent suspects to arrest/kill</li>
                            <li><strong>Clean Interface:</strong> Arrow buttons hidden on touch devices</li>
                            <li><strong>Responsive Design:</strong> Optimized for all screen sizes</li>
                        </ul>
                    </div>
                </Col>
            </Row>

            <div className={css.visualCues}>
                <h5>👁️ Visual Indicators</h5>
                <ul className={css.cuesList}>
                    <li><strong>Red Border:</strong> Your current character position</li>
                    <li><strong>Gray Border:</strong> Suspects with alibis (protected)</li>
                    <li><strong>Hover Effects:</strong> Clickable tiles highlight on hover</li>
                    <li><strong>Dead Overlay:</strong> X marks eliminated suspects</li>
                </ul>
            </div>
        </div>
    )

    const renderContent = () => {
        switch (selectedMode) {
            case 'detective':
                return renderDetectiveRules()
            case 'killer':
                return renderKillerRules()
            case 'controls':
                return renderControlsGuide()
            case 'all':
            default:
                return (
                    <>
                        {renderGameOverview()}
                        {renderDetectiveRules()}
                        {renderKillerRules()}
                        {renderControlsGuide()}
                    </>
                )
        }
    }

    return (
        <Modal 
            show={show} 
            onHide={onHide} 
            size="xl" 
            centered
            className={css.rulesModal}
        >
            <Modal.Header closeButton className={`${utilStyles.bg_darkGrey} text-white`}>
                <Modal.Title>📋 Game Rules & Guide</Modal.Title>
            </Modal.Header>
            
            <Modal.Body className={`${utilStyles.bg_darkGrey} text-white ${css.modalBody}`}>
                {showModeSelector && (
                    <div className={css.modeSelector}>
                        <div className={css.tabButtons}>
                            <button 
                                className={`${css.tabButton} ${selectedMode === 'all' ? css.active : ''}`}
                                onClick={() => handleModeChange('all')}
                            >
                                📖 Complete Guide
                            </button>
                            <button 
                                className={`${css.tabButton} ${selectedMode === 'detective' ? css.active : ''}`}
                                onClick={() => handleModeChange('detective')}
                            >
                                🕵️ Detective
                            </button>
                            <button 
                                className={`${css.tabButton} ${selectedMode === 'killer' ? css.active : ''}`}
                                onClick={() => handleModeChange('killer')}
                            >
                                🔪 Killer
                            </button>
                            <button 
                                className={`${css.tabButton} ${selectedMode === 'controls' ? css.active : ''}`}
                                onClick={() => handleModeChange('controls')}
                            >
                                🎮 Controls
                            </button>
                        </div>
                    </div>
                )}
                
                <div className={css.content}>
                    {renderContent()}
                </div>
            </Modal.Body>
            
            <Modal.Footer className={`${utilStyles.bg_darkGrey} text-white`}>
                <Button variant="primary" onClick={onHide}>
                    Got it! Let's Play
                </Button>
            </Modal.Footer>
        </Modal>
    )
}