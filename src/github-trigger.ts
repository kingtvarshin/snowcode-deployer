import * as vscode from 'vscode';
import { exec } from 'child_process';

export async function triggerGitHubWorkflow(repo: string, workflow: string, token: string) {
    // Call GitHub Actions API to trigger workflow
}

export async function commitAndPushTerraform(filePath: string): Promise<void> {
    // TODO: Implement logic to commit and push file to GitHub using git CLI or GitHub API
    // For now, just show a message
    console.log(`Would commit and push: ${filePath}`);

    // // Get workspace folder
    // const workspaceFolders = vscode.workspace.workspaceFolders;
    // if (!workspaceFolders || workspaceFolders.length === 0) {
    //     vscode.window.showErrorMessage('No workspace folder open. Cannot commit and push.');
    //     return;
    // }
    // const workspacePath = workspaceFolders[0].uri.fsPath;

    // // Run git commands: add, commit, push
    // exec(`git add "${filePath}"`, { cwd: workspacePath }, (err) => {
    //     if (err) {
    //         vscode.window.showErrorMessage('Git add failed: ' + err.message);
    //         return;
    //     }
    //     exec(`git commit -m "Add Terraform config for Snowflake resource"`, { cwd: workspacePath }, (err) => {
    //         if (err) {
    //             vscode.window.showErrorMessage('Git commit failed: ' + err.message);
    //             return;
    //         }
    //         exec(`git push`, { cwd: workspacePath }, (err) => {
    //             if (err) {
    //                 vscode.window.showErrorMessage('Git push failed: ' + err.message);
    //             } else {
    //                 vscode.window.showInformationMessage('Terraform config committed and pushed to GitHub!');
    //             }
    //         });
    //     });
    // });
}