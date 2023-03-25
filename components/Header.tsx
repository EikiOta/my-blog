// components/Header.tsx
import Link from 'next/link';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.navUl}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/profile">Profile</Link> {/* Profileリンクを追加 */}
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
          <li>
            <Link href="/junkyard">Junkyard</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
