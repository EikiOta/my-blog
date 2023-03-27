// lib/posts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkImages from 'remark-images';
import remarkBreaks from 'remark-breaks'; // 追加
import remarkGfm from 'remark-gfm'; // 追加

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

export interface PostData {
  id: string;
  date: string;
  title: string;
  thumbnailUrl?: string;
  [key: string]: any;
}

export function getPaginatedPostsData(page: number, limit: number): PostData[] {
  const allPostsData = getSortedPostsData();
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return allPostsData.slice(startIndex, endIndex);
}

export function getSortedPostsData(): PostData[] {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Extract the first image URL
    const thumbnail = extractFirstImageUrl(matterResult.content);

    // Destructure the date and title from matterResult.data
    const { date, title } = matterResult.data;

    // Combine the data with the id, date, and title
    return {
      id,
      date,
      title,
      thumbnail,
    } as PostData;
  });

  // Sort posts by date
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

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .use(remarkImages)
    .use(remarkBreaks) // 追加
    .use(remarkGfm) // 追加
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}

function extractFirstImageUrl(content: string): string | undefined {
  const regex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(regex);
  return match ? match[1] : undefined;
}
