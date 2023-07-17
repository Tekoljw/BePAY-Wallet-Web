const webpack = require("webpack")
const path = require(`path`);
const alias = require(`./aliases`);
const { aliasWebpack } = require('react-app-alias');

const SRC = `./src`;
const aliases = alias(SRC);

const resolvedAliases = Object.fromEntries(
  Object.entries(aliases).map(([key, value]) => [key, path.resolve(__dirname, value)])
);

const options = {
  alias: resolvedAliases,
};

// module.exports = function override(config) {
//   config.ignoreWarnings = [{ message: /Failed to parse source map/ }];

//   config = aliasWebpack(options)(config);

//   config.module.rules[0].exclude = /node_modules/;
//   config.resolve.fallback = {
//       "fs": false,
//       "tls": false,
//       "net": false,
//       "http": require.resolve("stream-http"),
//       "https": false,
//       "zlib": require.resolve("browserify-zlib") ,
//       "path": require.resolve("path-browserify"),
//       "stream": require.resolve("stream-browserify"),
//       "util": require.resolve("util/"),
//       "os": require.resolve("os-browserify/browser"),
//       "crypto": require.resolve("crypto-browserify"),
//       "url": require.resolve("url/"),
//       "assert": require.resolve("assert/"),
//       "buffer": require.resolve("buffer")
//   };
//   config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"]
//   config.plugins = [
//       ...config.plugins,
//       new webpack.ProvidePlugin({
//           process: "process/browser",
//           Buffer: ["buffer", "Buffer"],
//       }),
//   ]
//  return config;
// };

module.exports = function override(config) {
  config.ignoreWarnings = [{ message: /Failed to parse source map/ }];
  config.devtool = false
  let returnObj = aliasWebpack(options)(config);
  
  
  let loaders = returnObj.resolve
  loaders.fallback = {
      "fs": false,
      "tls": false,
      "net": false,
      "http": require.resolve("stream-http"),
      "https": false,
      "zlib": require.resolve("browserify-zlib") ,
      "path": require.resolve("path-browserify"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/"),
      "os": require.resolve("os-browserify/browser"),
      "crypto": require.resolve("crypto-browserify"),
      
      "buffer": require.resolve('buffer'),
      "url": require.resolve("url"),
      "assert": require.resolve("assert/"),
      "process": require.resolve("process/browser"),
  };
  
  returnObj.module.rules[0].exclude = /node_modules/;
  
  let globalLoader = {
      test: /\.(js|mjs|jsx)$/,
      include: /node_modules/,
      loader: require.resolve('babel-loader'),
      options: {
          sourceType: 'unambiguous', // 这个一定要配，自动处理es和js模块
          compact: false, // 这个建议配，能提升性能
          plugins: [
              [
                  require.resolve('babel-plugin-import-globals'),
                  {
                      'process': require.resolve('process'),
                      'Buffer': {moduleName: require.resolve('buffer'), exportName: 'Buffer'},
                  },
              ],
          ],
      },
  };
  
  returnObj.module.rules.push(globalLoader);

  // returnObj.mode == "development"
  // returnObj.mode == "production"

  if(returnObj.mode == "production---split") {
    returnObj.output.sourceMapFilename = "sourcemaps/[file].map";

    // returnObj.optimization.runtimeChunk = {
    //   name: 'runtime'
    // };

    returnObj.optimization.splitChunks = { 
      chunks: "all", //指定打包同步加载还是异步加载 
      minSize: 900000, //构建出来的大于这个大小才会被分割 
      // minRemainingSize: 1000000, 
      maxSize: 0, //会尝试根据这个大小进行代码分割 
      // minChunks: 2, //用了几次才进行代码分割 
      maxAsyncRequests: 6, 
      maxInitialRequests: 3, 
      automaticNameDelimiter: "-", //文件生成的连接符 
      // runtimeChunk: true,
    };

  }

  // console.log(returnObj);

  // throw "error";
      
  return returnObj;
};
