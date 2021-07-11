import Head from 'next/head'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import Container from 'react-bootstrap/Container'


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
            <body className={utilStyles.bg_darkGrey}>
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
                            <aside className={`${utilStyles.headingMd} ${styles.asideMenu}`}>
                                <p>
                                    A game of who done it.
                                </p>
                                <h2>
                                    <Link href={'/game/killer'} >
                                        <a className="btn btn-danger">Killer</a>
                                    </Link>
                                    &nbsp;
                                    <Link href='/game/detective' >
                                        <a className="btn btn-primary">Detective</a>
                                    </Link>
                                </h2>
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
