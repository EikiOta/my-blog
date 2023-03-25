// pages/posts/[id].tsx
import { GetStaticProps, GetStaticPaths } from 'next';
import { getPostData, getSortedPostsData } from '../../lib/posts';



export interface PostData {
    id: string;
    date: string;
    title: string;
    [key: string]: any;
  }
interface PostProps {
  postData: {
    title: string;
    date: string;
    contentHtml: string;
  };
}

const Post = ({ postData }: PostProps) => {
  return (
    <div>
      <h1>{postData.title}</h1>
      <div>{postData.date}</div>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
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
