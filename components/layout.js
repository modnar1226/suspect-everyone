import Head from 'next/head'
import styles from './css/layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


export const siteTitle = 'Suspect Everyone'

export default function Layout({ children, home }) {
    return (
        <html>
            <Head>
                <link rel="icon" href="/favicon.png" />
                <meta
                    name="description"
                    content="Solve a mystery or go on a killing spree."
                />
            </Head>
            <body className={`${utilStyles.bg_darkGrey}`}>
                <Container fluid>
                        {home ? (
                            <>
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
                                                <a id={`${styles.mode1}`} href="/game/detective" className={`text-white border p-2 ${styles.modeLink}`}>
                                                    Detective Mode
                                                </a>
                                            </Col>
                                            <Col md="12" className="mt-2">
                                                <a id={`${styles.mode2}`} href="/game/killer" className={`text-white border p-2 ${styles.modeLink}`}>
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
                            </>
                        ) : (
                                <>
                                    
                                </>
                            )}
                    
                    <div>
                        {children}
                    </div>
                </Container>
            </body>
        </html>
    )
}
