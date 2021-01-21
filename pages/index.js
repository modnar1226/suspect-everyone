import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Hello Ian, are you a Killer or a Detective?</p>
        <p>
          To get started, make a decision by clicking one of the options below. 
        </p>
        <h2>
          <Link href={'/game/detective'} >
            <a className="btn btn-danger">Killer</a>
          </Link>
          &nbsp;
          <Link href='/game/detective' >
            <a className="btn btn-primary">Detective</a>
          </Link>
        </h2>
      </section>
      
    </Layout>
  )
}
