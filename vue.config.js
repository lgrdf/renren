const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, // 关闭语法检查

  // // // 开启代理服务器
  // devServer:{
  //   proxy: "https://apis.map.qq.com"
  // }

  devServer: {
    proxy: {
      '/api1': { // 匹配所有以 '/api1'开头的请求路径
        target: 'http://53599s50a3.zicp.vip:31762',// 代理目标的基础路径
        changeOrigin: true,
        pathRewrite: {'^/api1': ''}
      },
      '/api2': { // 匹配所有以 '/api2'开头的请求路径
        target: 'http://localhost:8085',// 代理目标的基础路径
        changeOrigin: true,
        pathRewrite: {'^/api2': ''}
      }
    }
  }

// changeOrigin设置为true时，服务器收到的请求头中的host为：localhost:5000
// changeOrigin设置为false时，服务器收到的请求头中的host为：localhost:8080

})
