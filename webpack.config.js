const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const env = process.env.NODE_ENV;

module.exports = {
  entry: "./src/index.ts",
  mode: env,
  devtool: env === "development" ? "inline-source-map" : false,
  output: {
    filename: "code.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    contentBase: "./dist",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /\.(svg|png|jpg|gif)$/,
        type: "asset/resource",
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "[name].css" }),
    new HtmlWebpackPlugin({
      title: "FigGen",
      template: "src/index.html",
      filename: "ui.html",
    }),
  ],
};
