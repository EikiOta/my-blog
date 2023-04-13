import { GetStaticProps, GetStaticPaths } from 'next';
import { getPostData, getSortedPostsData } from '../../lib/posts';
import markdownStyles from '../../styles/markdown.module.css';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface PostProps {
  postData: {
    title: string;
    date: string;
    category: string;
    contentHtml: string;
  };
}

const Post = ({ postData }: PostProps) => {
  return (
    <div>
      <Head>
        <title>{postData.title}</title>
        <meta name="description" content={`Read the article: ${postData.title}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={markdownStyles.articleTitle}>{postData.title}</h1>
      <div className={markdownStyles.articleDate}>{postData.date}</div>
      <div className={markdownStyles.articleCategory}>{postData.category}</div>

      <ReactMarkdown
        className={markdownStyles.markdown}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {postData.contentHtml}
      </ReactMarkdown>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getSortedPostsData().map((post) => {
    return {
      params: {
        id: post.id,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params) {
    return {
      notFound: true,
    };
  }

  const postData = await getPostData(params.id as string);
  return {
    props: {
      postData,
    },
  };
};

export default Post;
