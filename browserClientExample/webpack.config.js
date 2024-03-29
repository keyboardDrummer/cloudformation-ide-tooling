/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const path = require('path');
const lib = path.resolve(__dirname, "lib");

const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const common = {
    entry: {
        "json": path.resolve(lib, "json.js"),
        "yaml": path.resolve(lib, "yaml.js"),
        "editor.worker": 'monaco-editor/esm/vs/editor/editor.worker.js',
        "server.worker": path.resolve(lib, "server.worker.js")
    },
    output: {
        filename: '[name].bundle.js',
        path: lib
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /\.ttf$/,
            use: ['file-loader']
        }]
    },
    target: 'web',
    node: {
        fs: 'empty',
        child_process: 'empty',
        net: 'empty',
        crypto: 'empty'
    },
    resolve: {
        extensions: ['.js', '.json', '.ttf'],
        alias: {
            'vscode': require.resolve('monaco-languageclient/lib/vscode-compatibility')
        }
    }
};

if (process.env['NODE_ENV'] === 'production') {
    module.exports = merge(common, {
        plugins: [
            new UglifyJSPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            new webpack.ContextReplacementPlugin(
                /vscode*/,
                path.join(__dirname, './client')
            )
        ]
    });
} else {
    module.exports = merge(common, {
        plugins: [
            new webpack.ContextReplacementPlugin(
                /vscode*/,
                path.join(__dirname, './client')
            )
        ]
    });
}
