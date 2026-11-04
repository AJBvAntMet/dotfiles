"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode_1 = require("vscode");
const vscode = require("vscode");
const path = require("path");
const node_1 = require("vscode-languageclient/node");
let client;
function activate(context) {
    const isDevMode = context.extensionMode === vscode.ExtensionMode.Development;
    const serverOptions = {
        run: {
            command: isDevMode
                ? context.asAbsolutePath(path.join("node_modules", ".bin", "nodemon"))
                : context.asAbsolutePath(path.join('out', 'terragrunt-ls')),
            args: isDevMode ? [
                "-q",
                "--watch", "./**/*.go",
                "--signal", "SIGTERM",
                "--exec", "go", "run", "./main.go"
            ] : [],
            transport: node_1.TransportKind.stdio,
            options: isDevMode ? {
                cwd: context.asAbsolutePath(".."),
                env: { ...process.env, TG_LS_LOG: "debug.log" }
            } : undefined
        },
        debug: {
            command: context.asAbsolutePath(path.join("node_modules", ".bin", "nodemon")),
            args: [
                "-q",
                "--watch", "./**/*.go",
                "--signal", "SIGTERM",
                "--exec", "go", "run", "./main.go"
            ],
            transport: node_1.TransportKind.stdio,
            options: {
                cwd: context.asAbsolutePath(".."),
                env: { ...process.env, TG_LS_LOG: "debug.log" }
            }
        }
    };
    // Options to control the language client
    const clientOptions = {
        // Register the server for Terragrunt files
        documentSelector: [
            { scheme: 'file', language: 'terragrunt' },
        ],
        synchronize: {
            // Notify the server about file changes to Terragrunt files
            fileEvents: vscode_1.workspace.createFileSystemWatcher('**/*.hcl')
        }
    };
    // Create the language client and start the client.
    client = new node_1.LanguageClient('terragrunt-ls', 'Terragrunt Language Server', serverOptions, clientOptions);
    // Start the client. This will also launch the server
    client.start();
}
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
//# sourceMappingURL=extension.js.map