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
        <p>Hello</p>
        <p>
          put more stuff here
        </p>
        <h2>
          <Link href="/game/board" >
            <a>GameBoard</a>
          </Link>
        </h2>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <p>Email: {result.email}</p>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              {title}
              <br />
              {id}
              <br />
              {date}
            </li>
          ))}
        </ul>
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
  console.log(result);
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

