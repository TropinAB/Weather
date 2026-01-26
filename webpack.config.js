const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const NODE_ENV = process.env.NODE_ENV || "development";
const PREFIX = NODE_ENV === "production" ? "/Weather/" : "/";

module.exports = {
  entry: "./src/index.js",
  output: {
    publicPath: NODE_ENV === "production" ? PREFIX : "/",
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
      publicPath: PREFIX,
      // template: "src/index.html",
    }),
    new HtmlWebpackPlugin({
      filename: "404.html",
      publicPath: PREFIX,
      // template: "src/index.html",
    }),
    new webpack.DefinePlugin({
      PRODUCTION: NODE_ENV === "production",
      NODE_ENV: JSON.stringify(NODE_ENV),
      PREFIX: JSON.stringify(PREFIX),
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
