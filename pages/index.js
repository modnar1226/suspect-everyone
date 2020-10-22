import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
//import query from '../lib/database'
import Link from 'next/link'
import { PrismaClient } from '@prisma/client';

export default function Home({ allPostsData, result }) {
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

export async function getServerSideProps() {
  // fetch post data, could be database calls
  const allPostsData = getSortedPostsData()
  /*const result = JSON.parse(JSON.stringify(await query({
    query: 'SELECT * FROM users',
    values: []
  }).then(function (results) { return results })));
  console.log(result);
  */
  const prisma = new PrismaClient();
  const result = JSON.parse(JSON.stringify(await prisma.users
    .findOne({
      where: {email : 'isg1315122@gmail.com'}
    })
    .contacts()
  ));
  return {
    props: {
      allPostsData,
      result
    }
  }
}

// static properties, used to preload a page
/*
export async function getStaticProps() {
  // fetch post data, could be database calls
  const allPostsData = getSortedPostsData()
  const result = JSON.parse(JSON.stringify(await query({
    query: 'SELECT * FROM users',
    values: []
  }).then(function(results){return results})));
  console.log(result);
  return {
    props: {
      allPostsData,
      result
    }
  }
}
*/

