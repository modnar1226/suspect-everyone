import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/layout'

export default function FirstPost() {
    const styleGreen = {background : "green"};
    return (
        <>
            <Layout>

            
            <Head>
                <title>First Post</title>
            </Head>
            <div className="grid" style={styleGreen}>
                <div className="card">
                    <h1>First Post</h1>
                    <h2>
                        <Link href="/">
                            <a>Back to home</a>
                        </Link>
                    </h2>
                </div>
                <div className="card">
                    <h1>First Post</h1>
                    <h2>
                        <Link href="/">
                            <a>Back to home</a>
                        </Link>
                    </h2>
                </div>
            </div>
            </Layout>
        </>
    )
}
