
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkImages from 'remark-images';
 
import remarkGfm from 'remark-gfm'; 

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

export interface PostData {
  id: string;
  date: string;
  title: string;
  thumbnailUrl?: string;
  category?: string; 
  [key: string]: any;
}

export function getPaginatedPostsData(page: number, limit: number): PostData[] {
  const allPostsData = getSortedPostsData();
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return allPostsData.slice(startIndex, endIndex);
}

export function getSortedPostsData(): PostData[] {

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {

    const id = fileName.replace(/\.md$/, '');


    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');


    const matterResult = matter(fileContents);

    const thumbnail = extractFirstImageUrl(matterResult.content);


    return {
      id,
      thumbnail,
      ...(matterResult.data as { date: string; title: string; category: string }), 
    } as PostData;
  });

//そーと
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}


export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  // ここで remark-gfm を適用
  const processedContent = await remark()
    .use(remarkGfm)
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...matterResult.data as { date: string; title: string; category: string },
  };
}




function extractFirstImageUrl(content: string): string | undefined {
  const regex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(regex);
  return match ? match[1] : undefined;
}
