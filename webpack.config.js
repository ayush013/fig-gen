const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLInlineCSSWebpackPlugin =
  require("html-inline-css-webpack-plugin").default;
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");

const ENVIRONMENT = {
  PROD: "production",
  DEV: "development",
};

const env = process.env.NODE_ENV;
const plugins = [
  new HtmlWebpackPlugin({
    title: "FigGen",
    template: "src/app/index.html",
    chunks: ["htmlApp"],
    filename: "ui.html",
    inject: "body",
  }),
  new HTMLInlineCSSWebpackPlugin(),
  new HtmlInlineScriptPlugin(),
];

env === ENVIRONMENT.PROD &&
  plugins.unshift(new MiniCssExtractPlugin({ filename: "[name].css" }));

module.exports = {
  entry: {
    code: "./src/index.ts",
    htmlApp: "./src/app/main.ts",
  },
  mode: env,
  devtool: false,
  output: {
    filename: (chunkData) => {
      return chunkData.chunk.name === "code"
        ? "[name].js"
        : "[name].[chunkhash:8].js";
    },
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    contentBase: "./dist",
  },
  resolve: {
    extensions: [".ts", ".js"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
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
        type: "asset/inline",
      },
      {
        test: /\.(scss|css)$/,
        use: [
          env === ENVIRONMENT.DEV
            ? "style-loader"
            : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          "postcss-loader",
        ],
      },
    ],
  },
  plugins,
};
