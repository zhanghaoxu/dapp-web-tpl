import proxy from './proxy';
import routes from './routes';
var S3Plugin = require('webpack-s3-plugin');
const useCDN = process.env.CDN === 'yes';
export default {
  metas: [{ name: 'http-equiv', content: 'no-cache' }],
  npmClient: 'pnpm',
  //bug
  vite: {},
  proxy,
  routes,
  hash: true,
  publicPath: useCDN ? `https://${process.env.CDN_PATH}/${process.env.CDN_PREFIX}/` : '/',
  define: {
    'process.env': process.env,
  },
  chainWebpack: (memo: any) => {
    if (useCDN) {
      memo.plugin('s3-plugin').use(
        new S3Plugin({
          // Exclude uploading of html
          exclude: /.*\.html$/,
          // s3Options are required
          s3Options: {
            accessKeyId: process.env.CDN_ACCESS_KEY_ID,
            secretAccessKey: process.env.CDN_SECRET_ACCESS_KEY,
            region: process.env.CDN_REGION,
          },
          basePath: process.env.CDN_PREFIX,
          s3UploadOptions: {
            Bucket: process.env.CDN_BUCKET,
            ACL: 'private',
          },
        })
      );
    }
  },
  tailwindcss: {},
  plugins: ['@umijs/plugins/dist/tailwindcss'],
};
