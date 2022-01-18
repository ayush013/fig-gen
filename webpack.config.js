const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLInlineCSSWebpackPlugin =
  require("html-inline-css-webpack-plugin").default;
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");

const env = process.env.NODE_ENV;
const plugins = [
  new HtmlWebpackPlugin({
    title: "FigGen",
    template: "src/index.html",
    chunks: ["htmlApp"],
    filename: "ui.html",
    inject: "body",
  }),
  new HTMLInlineCSSWebpackPlugin(),
  new HtmlInlineScriptPlugin(),
];

env === "production" &&
  plugins.unshift(new MiniCssExtractPlugin({ filename: "[name].css" }));

module.exports = {
  entry: {
    code: "./src/index.ts",
    htmlApp: "./src/app/main.ts",
  },
  mode: env,
  devtool: env === "development" ? "inline-source-map" : false,
  output: {
    filename: "[name].js",
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
          env === "development" ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          "postcss-loader",
        ],
      },
    ],
  },
  plugins,
};
