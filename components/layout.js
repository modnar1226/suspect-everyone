import Head from 'next/head'
import utilStyles from '../styles/utils.module.css'
import SplashScreen from './splashScreen'

export const siteTitle = 'Suspect Everyone'

export default function Layout({ children, home, detective }) {
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
                    {home ? <SplashScreen/> : null}
                    {detective ? <SplashScreen /> : null}
                    <div>
                        {children}
                    </div>
            </body>
        </html>
    )
}
