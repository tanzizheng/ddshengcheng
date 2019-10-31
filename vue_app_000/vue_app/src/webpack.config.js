var path=require('path')

module.exports={
  entry: path.join(__dirname, './main.js'), // 入口文件
  output: { // 指定输出选项
    path: path.join(__dirname, './dist'), // 输出路径
    filename: 'bundle.js' // 指定输出文件的名称
  },
  module:{
    rules:[
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },//处理css文件的规则
      { test: /\.vue$/, use: 'vue-loader' },
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  resolve:{
    alias:{
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
}