import styles from './css/layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function SplashScreen() {
    return (
        <Container fluid>
            <header>
                <img
                    src="images/SuspectEveryoneLogoLg.png"
                    className={`${styles.headerHomeImage}`}
                    alt="logo"
                />
            </header>
            <section className={`${utilStyles.headingMd} ${styles.splashNote} text-white`}>
                <p className="text-center">
                    A game of who done it.
                </p>
            </section>
            <aside className={`${utilStyles.headingMd} ${styles.asideMenu} text-white text-left`}>
                <Row >
                    <Col sm="12" md="7" lg="6" xl="5">
                        <Row>
                            <Col md="12" className="mt-2">
                                <a id={`${styles.mode1}`} href="detective" className={`text-white border p-2 ${styles.modeLink}`}>
                                    Detective Mode
                                </a>
                            </Col>
                            <Col md="12" className="mt-2">
                                <a id={`${styles.mode2}`} href="killer" className={`text-white border p-2 ${styles.modeLink}`}>
                                    Killer Mode
                                </a>

                            </Col>
                        </Row>
                    </Col>
                    <Col sm="12" md="5" className="mt-2">
                        <a id={`${styles.rules}`} href="#" className={`border p-2 ${styles.invert}`}>
                            Rules
                        </a>
                    </Col>
                </Row>
                <Row>
                    <Col sm="12" md="12" className="mt-2">
                    </Col>
                </Row>
            </aside>
        </Container>
    )
}