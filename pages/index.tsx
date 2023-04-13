import type { NextPage } from 'next';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import styles from '../styles/Home.module.css';
import Head from 'next/head';
import { useState } from 'react';
import { getSortedPostsData } from '../lib/posts';
const POSTS_PER_PAGE = 9;

interface HomeProps {
  allPostsData: {
    id: string;
    date: string;
    title: string;
    thumbnail: string;
    category: string;
  }[];
  page: number;
  hasNextPage: boolean;
}

const Home: NextPage<HomeProps> = ({ allPostsData, page, hasNextPage }) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = Array.from(
    new Set(allPostsData.map((post) => post.category))
  );

  const filteredPosts = allPostsData.filter((post) =>
    selectedCategory ? post.category === selectedCategory : true
  );

  const paginatedPosts = filteredPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );
  return (
    <div className={styles.container}>
      <Head>
        <title>SK99 Blog</title>
        <meta name="description" content="Welcome to SK99 Blog" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.title}>SK99 Blog</h1>
      <div className={styles.categoryFilter}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={styles.selectBox} 
        >
          <option value="">カテゴリを選択</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.main}>
      <div className={styles.grid}>
  {allPostsData
    .filter((post) =>
      selectedCategory ? post.category === selectedCategory : true
    )
    .map(({ id, date, title, thumbnail, category }) => (
      <Link key={id} href={`/posts/${id}`} passHref>
        <div className={styles.post}>
          <img src={thumbnail} alt={title} />
          <div className={styles.postContent}>
            <h2 className={styles.postTitle}>{title}</h2>
            <div className={styles.postMeta}>
              <span>{category}</span>
              <span className={styles.postDate}>{date}</span>
            </div>
            <p>{/*本文の抜粋表示 */}</p>
          </div>
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
  const allPostsData = (await getSortedPostsData()).map((post) => ({
    ...post,
    thumbnail: post.thumbnail || null,
  })); //getSortedPostsData使用

  return {
    props: {
      allPostsData,
      page,
    },
  };
};

export default Home;
