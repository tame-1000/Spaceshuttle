const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/app/app.jsx",
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/templates/index.html",
    }),
  ],
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "build/app.js",
  },
  resolve: {
    modules: [path.resolve(__dirname, "node_modules")],
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: ["react-html-attrs", "@babel/plugin-transform-runtime"],
              presets: ["@babel/preset-react", "@babel/preset-env"],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: "file-loader",
        options: {},
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 9000,
  },
};
