/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
const BASE_URL = 'http://your_backend_domain/'
module.exports = {
  assetsDir: "sitefront",
  productionSourceMap: false,
  transpileDependencies: ['@xdh/my'],
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
    },
    mobile: {
      entry: 'src/mobile/mobile.main.js',
      template: 'public/mobile.html',
    },
  },
  chainWebpack(chain) {
    chain.resolve.alias.set('$ui', '@xdh/my/ui/lib')
  },
  devServer: {
    https: false,
    proxy: {
      "/api/v1": {
        target: BASE_URL + 'api/v1',
        secure: false,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api/v1": "/"
        }
      },
      '/media': {
        target: BASE_URL + 'media',
        changeOrigin: true,
        pathRewrite: {
          '^/media': '/'
        },
        secure: false
      }
    }
  },
}
