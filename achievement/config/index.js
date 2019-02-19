// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    port: 3000,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // proxyTable: {
    //   '/api': 'http://localhost:3001'
    // },
   proxyTable: {
      '/api': {
      //target: 'http://192.168.2.131:9998',
      //target: 'http://ku.test.lvzheng.com:9998',
      //target: 'http://192.168.7.70:9998',
      //target: 'http://192.168.5.231:9998',
      //target: 'http://192.168.6.70:9998',
      //target: 'http://192.168.6.71:9998',
      //target: 'http://192.168.6.44:9998',
      //target: 'http://192.168.7.33:9998',
      //target: 'http://192.168.7.253:9998',
      // target:'http://gateway.testlvzheng.com',
      // target:'http://jebe.lvzheng.com:3050',
        // target:'http://192.168.1.9:3050',
        // target:'http://jebe.lvzheng.com',
       // target:'http://192.168.2.77:9998',
        // target:'http://192.168.2.22:4050',
        target:'http://10.10.240.91:4050',
        changeOrigin: true,
        // pathRewrite: {
        //   '^/api': '/'
        // }
      },
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
