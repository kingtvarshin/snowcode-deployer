import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage('Snowflake DataOps Assistant Activated!');
    // Register commands and UI here
}

export function deactivate() {}