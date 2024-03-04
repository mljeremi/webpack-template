const path = require('path')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const JsonMinimizerPlugin = require('json-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'
const processEnv = process.env.NODE_ENV ?? 'development'

const paths = {
  src: path.join(__dirname, '/src'),
  dist: path.join(__dirname, '/dist'),
  public: path.join(__dirname, '/public'),

  assets: 'assets/',
  static: 'static/'
}

const devServer = {
  devMiddleware: {
    writeToDisk: true
  },
  compress: true,
  open: true,
  hot: true,
  port: 9000,
  client: {
    progress: false,
    overlay: {
      errors: false,
      warnings: false
    }
  },
  allowedHosts: 'all',
  historyApiFallback: true
}

const filenames = {
  production: {
    output: `${paths.assets}[name].min.js`,
    css: `${paths.assets}/[name].min.css`
  },
  development: {
    output: `${paths.assets}[name].js`,
    css: `${paths.assets}/[name].css`
  }
}

module.exports = {
  mode: processEnv,
  devtool: false,
  devServer: isProd ? {} : devServer,
  entry: {
    app: `${paths.src}/index.ts`
    /** lk: `${paths.src}/lk/index.ts` **/
  },
  output: {
    path: paths.dist,
    filename: filenames[processEnv].output
  },

  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  optimization: {
    minimize: isProd,
    minimizer: [
      new JsonMinimizerPlugin(),
      new TerserPlugin(),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true }
            }
          ]
        }
      })
    ]
  },

  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env'
                  ]
                ],
                postcssOptions: {
                  parser: 'postcss-js'
                },
                execute: true
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isProd
            }
          }
        ]
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: [
          '@svgr/webpack'
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: filenames[processEnv].css,
      chunkFilename: '[id].css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${paths.src}/shared/img`,
          to: `${paths.dist}/${paths.static}`
        }
      ]
    }),
    new HtmlWebpackPlugin({
      title: 'My app',
      // favicon: paths.src + '/shared/misc/favicon.ico',
      template: paths.public + '/index.html',
      filename: 'index.html'
    })
  ],

  resolve: {
    alias: {
      '@': paths.src
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  watchOptions: {
    ignored: /node_modules/
  }
}
