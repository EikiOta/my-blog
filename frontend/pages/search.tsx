
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/Search.module.css';

type SearchResult = {
  id: string;
  title: string;
  score: number;
};

const Search: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    //環境変数を使ってバックエンドのURLを指定
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetch(`${backendUrl}/api/search?query=${searchTerm}`, {
      credentials: 'include',
    });
    
    const data = await response.json();
    console.log(data);
    setSearchResults(data);
  };
  
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Search</title>
        <meta name="description" content="Search for posts on SK99 Blog" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.title}>全文検索(β) 英語のみ対応</h1>
      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="検索"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button className={styles.searchButton} type="submit">検索</button>
      </form>
      <div className={styles.searchResults}>
        {searchResults === null ? (
          <></>
        ) : searchResults.length === 0 ? (
          <p>該当記事なし</p>
        ) : (
          searchResults.map(({ id, title, score }) => (
            <div key={id} className={styles.result}>
              <h2>
                <Link href={`/posts/${id}`}>
                  {title}
                </Link>
              </h2>
              <p>ID: {id}</p>
              <p>Score: {score.toFixed(2)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Search;
