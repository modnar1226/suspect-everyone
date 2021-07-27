/**
 * Original game created by Maureen Birdsall and husband Mike
 * React version of game created by Ian Greene Nov 2020 
 */

import Head from 'next/head'
import MoveUpButton from '../components/moveUpButton'
import MoveDownButton from '../components/moveDownButton'
import MoveLeftButton from '../components/moveLeftButton'
import MoveRightButton from '../components/moveRightButton'
import Tile from '../components/tile'
import css from '../components/css/tile.module.css'
import React, {useState} from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Alibi from '../components/alibi'
import SecretIdentity from '../components/secretIdentity.func'

export default function GameLayout () {
    const [suspects, setSuspects] = useState([])
    const [killCount, setKillCount] = useState(0)
    const [evidenceDeck, setEvidenceDeck] = useState([])
    const [modalState, setModalState] = useState(true)
    const [alibiList, setAlibilist] = useState([])
    const [secretIdentity, setSecretIdentity] = useState([])
    const [playerSelect, setPlayerSelect] = useState([])
    const [killersIdentity, setKillersIdentity] = useState([])
    const [arrestList, setArrestList] = useState([])
    const [whosTurn, setWhosTurn] = useState('Killer')

    function arrestSuspect(){
       // const location = this.getLocation(secretIdentity[0].id)
       // const availableArrests = this.getAdjacent(location, true)
       // let arrestList = []
       // availableArrests.map((location) => {
       //     arrestList.push(suspects[location[0]][location[1]])
       // })
        //this.setState({
        //    showArrestList: !showArrestList,
        //    arrestList: arrestList
        //})
    }

    function handleClick(index, direction) {
        //moveBoard(index, direction, this.KILLER)
        //killersTurn()
    }

    return (
        <body>
            <Head>
                <title>Detective Mode</title>
            </Head>
            <Row className={`text-white`}>
                <Col md={3}>
                    <Row>
                        <Col md={12} className={css.evidenceHeader}>
                            <h5 >Rules</h5>
                            <ol>
                                <li>You may shift the board in any direction 1 time.</li>
                                <li>You may reveal that 1 of the suspects has an alibi.</li>
                                <li>You may try to make an arrest by selecting a tile adjacent to your current location.</li>
                            </ol>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col md={12} className={css.evidenceHeader}>
                            <h5 >Secret Identity</h5>
                            {secretIdentity.map((alibi, i) => {
                                return (
                                    <SecretIdentity key={`secId-${i}`} id={alibi.id} name={alibi.name} alive={alibi.alive} image={alibi.image}></SecretIdentity>
                                )
                            })}
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col md={12} className={css.evidenceHeader}>
                            <h5 className={css.evidenceHeader}>Alibis</h5>
                            Remove dead alibis, and draw new card by clicking them.
                        </Col>
                        <Col md={12} className={css.evidenceHeader}>
                            {alibiList.map((alibi, i) => {
                                return (
                                    <Alibi
                                    key={`alibi-${alibi.id}`}
                                    alibiSuspect={alibiSuspect}
                                    alibiIndex={i}
                                    susId={alibi.id}
                                    name={alibi.name}
                                    image={alibi.image}
                                    alive={alibi.alive}>
                                    </Alibi>
                                )
                            })}
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col md={12} className={css.evidenceHeader}>
                            <h5>Attempt Arrest</h5>
                            <Button variant="warning" onClick={arrestSuspect}>Select Suspect</Button>
                        </Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row className="justify-content-md-center">
                        <div className={css.spacer}></div>
                        <MoveUpButton handleClick={handleClick} direction='up' index='0' />
                        <MoveUpButton handleClick={handleClick} direction='up' index='1' />
                        <MoveUpButton handleClick={handleClick} direction='up' index='2' />
                        <MoveUpButton handleClick={handleClick} direction='up' index='3' />
                        <MoveUpButton handleClick={handleClick} direction='up' index='4' />
                    </Row>
                    {suspects.map((row, rowIndex) => {
                        return (
                            <Row key={`boardRow-${rowIndex}`} className="justify-content-md-center">
                                <MoveLeftButton key={`0-${rowIndex}`} handleClick={handleClick} direction='left' index={rowIndex} />
                                {row.map((suspect) => {
                                    return (
                                        <Tile
                                        key={suspect.id}
                                        id={suspect.id}
                                        name={suspect.name}
                                        alive={suspect.alive}
                                        image={suspect.image}
                                        alibiedImage={suspect.alibiedImage}
                                        alibied={suspect.alibied}
                                        isPlayer={suspect.isPlayer}
                                        ></Tile>
                                        )
                                    })
                                }
                                <MoveRightButton key={`1-${rowIndex}`} handleClick={handleClick} direction='right' index={rowIndex} />
                            </Row>
                        )
                    })}
                    <Row className="justify-content-md-center">
                        <div className={css.spacer}></div>
                        <MoveDownButton handleClick={handleClick} direction='down' index='0' />
                        <MoveDownButton handleClick={handleClick} direction='down' index='1' />
                        <MoveDownButton handleClick={handleClick} direction='down' index='2' />
                        <MoveDownButton handleClick={handleClick} direction='down' index='3' />
                        <MoveDownButton handleClick={handleClick} direction='down' index='4' />
                    </Row>
                </Col>
                <Col md={3}>
                    <Row>
                        <Col md={12} className={css.evidenceHeader}>
                            <h2 className={(whosTurn === 'Detective' ? css.txtBlue : css.txtRed)}>
                                {whosTurn}'s Turn
                            </h2>
                            <h4>People Killed: {killCount}</h4>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </body>
    )
}