const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const { template } = require("@babel/core");

module.exports = {
  entry: "./src/index.js",
  output: {
    publicPath: "/",
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 9000,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      publicPath: "/",
      // template: "src/index.html",
    }),
    new HtmlWebpackPlugin({
      filename: "404.html",
      publicPath: "/",
      // template: "src/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
