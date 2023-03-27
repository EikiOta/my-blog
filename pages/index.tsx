import type { NextPage } from 'next';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import styles from '../styles/Home.module.css';
import Head from 'next/head';
import { getPaginatedPostsData } from '../lib/posts';
const POSTS_PER_PAGE = 9;

interface HomeProps {
  allPostsData: {
    id: string;
    date: string;
    title: string;
    thumbnail: string;
  }[];
  page: number;
  hasNextPage: boolean;
}

const Home: NextPage<HomeProps> = ({ allPostsData, page, hasNextPage }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>SK99 Blog</title>
        <meta name="description" content="Welcome to SK99 Blog" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.title}>SK99 Blog</h1>
      <div className={styles.main}>
        <div className={styles.grid}>
          {allPostsData.map(({ id, date, title, thumbnail }) => (
            <Link key={id} href={`/posts/${id}`} passHref>
              <div className={styles.post}>
                <img src={thumbnail} alt={title} />
                <h2>{title}</h2>
                <p>{date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.pagination}>
        <Link href={`/?page=${page - 1}`} passHref>
          <button disabled={page === 1}>前ページへ</button>
        </Link>
        <span>{page}</span>
        <Link href={`/?page=${page + 1}`} passHref>
          <button disabled={!hasNextPage}>次ページへ</button>
        </Link>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const page = parseInt(query.page as string) || 1;
  const allPostsData = await getPaginatedPostsData(page, POSTS_PER_PAGE);
  const hasNextPage = allPostsData.length === POSTS_PER_PAGE; // 次のページがあるかどうか判断

  return {
    props: {
      allPostsData,
      page,
      hasNextPage,
    },
  };
};

export default Home;
