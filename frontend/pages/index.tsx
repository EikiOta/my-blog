
import type { NextPage } from 'next';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import styles from '../styles/Home.module.css';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { getSortedPostsData, PostData } from '../lib/posts';

const POSTS_PER_PAGE = 9;

interface HomeProps {
  allPostsData: PostData[];
  page: number;
  hasNextPage: boolean;
}

const Home: NextPage<HomeProps> = ({ allPostsData, page, hasNextPage }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(allPostsData);

  useEffect(() => {
    if (selectedCategory === '') {
      setFilteredPosts(allPostsData);
    } else {
      const newFilteredPosts = allPostsData.filter(
        (post) => post.category === selectedCategory
      );
      setFilteredPosts(newFilteredPosts);
    }
  }, [selectedCategory, allPostsData]);

  const categories = Array.from(
    new Set(allPostsData.map((post) => post.category))
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
          {paginatedPosts.map(({ id, date, title, thumbnail, category }) => (
            <Link key={id} href={`/posts/${id}`} passHref>
              <div className={styles.post}>
                <img src={thumbnail} alt={title} />
                <div className={styles.postContent}>
                  <h2 className={styles.postTitle}>{title}</h2>
                  <div className={styles.postMeta}>
                    <span>{category}</span>
                    <span className={styles.postDate}>{date}</span>
                  </div>
                  <p>{/*ほんぶｎ*/ }</p>
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

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
  const { page } = context.query;
  const pageNumber = page ? parseInt(page as string) : 1;

  const allPostsData = getSortedPostsData();
  const hasNextPage = allPostsData.length > pageNumber * POSTS_PER_PAGE;

  return {
    props: {
      allPostsData,
      page: pageNumber,
      hasNextPage,
    },
  };
};

export default Home;
