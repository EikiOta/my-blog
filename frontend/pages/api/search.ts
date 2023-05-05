import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { createProxyMiddleware } from 'http-proxy-middleware';

const proxyMiddleware = createProxyMiddleware({
  target: process.env.NEXT_PUBLIC_API_PROXY_TARGET,
  changeOrigin: true,
  pathRewrite: {
    '^/api/search': '/search',
  },
});


const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    res.status(200).end();
    return;
  }
  next();
});

handler.use((req, res, next) => {
  // TypeScriptエラーを回避するため一時的に型を剥がす
  const anyProxy = proxyMiddleware as any;
  anyProxy(req, res, next);
});

export default handler;
