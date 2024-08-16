export default {
  '/api': {
    // 要代理的地址
    target:
      'https://nei.hz.netease.com/api/apimock-v2/1a4540a6127381afc2301dda5fb28f2f/',
    //target: 'your server url',
    changeOrigin: true,
  },
};
