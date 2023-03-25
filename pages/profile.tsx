import Head from 'next/head';
import styles from '../styles/Profile.module.css';

const Profile = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Profile</title>
        <meta name="description" content="My profile page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.profile}>
          <img src="/images/ike.png" alt="Profile Picture" width="256" height="256" />
          <h1>SK99</h1>
          <p>
            ブログ初心者です、よろしくお願いします。
          </p>
        </div>
      </main>
    </div>
  );
};

export default Profile;
