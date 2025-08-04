# Project Code Walkthrough

## 1. src/extension.ts

This is the main entry point for your VS Code extension.

```typescript
import * as vscode from 'vscode';
// Imports the VS Code API so you can interact with the editor.

import { generateTerraform } from './terraform-generator';
// Imports the function that generates Terraform code for Snowflake resources.

import * as path from 'path';
// Imports Node.js path module for handling file paths.

import * as fs from 'fs';
// Imports Node.js file system module for reading/writing files.

import { commitAndPushTerraform } from './github-trigger';
// Imports the function that will commit and push Terraform files to GitHub.

import { sendSlackNotification } from './slack';
// Imports the function that sends notifications to Slack.

import * as dotenv from 'dotenv';
// Imports dotenv to load environment variables from a .env file.

let envFilePath: string | undefined;
// Declares a variable to store the path to the selected .env file.

dotenv.config({ path: path.join(__dirname, '..', '.env') });
// Loads environment variables from the .env file in the project root.

export function activate(context: vscode.ExtensionContext) {
// This function is called when your extension is activated in VS Code.

    vscode.window.showInformationMessage('Snowflake DataOps Assistant Activated!');
    // Shows a message in VS Code when the extension starts.

    // Command to select .env file
    const selectEnvDisposable = vscode.commands.registerCommand('snowflakeDataOps.selectEnvFile', async () => {
        // Registers a command that lets the user pick a .env file.

        const uri = await vscode.window.showOpenDialog({
            canSelectMany: false,
            filters: { 'Env Files': ['env'] },
            openLabel: 'Select .env file'
        });
        // Opens a file picker dialog for .env files.

        if (uri && uri[0]) {
            envFilePath = uri[0].fsPath;
            // Stores the selected file path.

            dotenv.config({ path: envFilePath, override: true });
            // Loads environment variables from the selected file, overriding previous values.

            vscode.window.showInformationMessage(`Loaded environment file: ${envFilePath}`);
            // Shows a message confirming the was loaded.

            console.log('Loaded webhook:', process.env.SLACK_WEBHOOK_URL);
            // Logs the Slack webhook URL for debugging.
        }
    });

    // Register the main command
    const disposable = vscode.commands.registerCommand('snowflakeDataOps.activate', async () => {
        // Registers the main command for the extension.

        if (!envFilePath) {
            // If no .env file was selected, try to load the default one from the workspace root.

            envFilePath = path.join(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '', '.env');
            dotenv.config({ path: envFilePath });
        }

        // Show Quick Pick for Snowflake resources
        const resources = ['Database', 'Warehouse', 'Schema'];
        // List of resources the user can manage.

        const selected = await vscode.window.showQuickPick(resources, {
            placeHolder: 'Select a Snowflake resource to manage'
        });
        // Shows a dropdown for the user to pick a resource.

        if (selected) {
            vscode.window.showInformationMessage(`Selected resource: ${selected}`);
            // Shows which resource was selected.

            const tfConfig = generateTerraform(selected);
            // Generates Terraform code for the selected resource.

            if (tfConfig) {
                // If code was generated, save it to a file.

                const workspaceFolders = vscode.workspace.workspaceFolders;
                // Gets the open workspace folders.

                if (workspaceFolders && workspaceFolders.length > 0) {
                    const filePath = path.join(workspaceFolders[0].uri.fsPath, `${selected.toLowerCase()}.tf`);
                    // Builds the path for the new Terraform file.

                    fs.writeFileSync(filePath, tfConfig, 'utf8');
                    // Writes the Terraform code to the file.

                    vscode.window.showInformationMessage(`Terraform config saved to ${filePath}`);
                    // Shows a message that the file was saved.

                    const doc = await vscode.workspace.openTextDocument(filePath);
                    await vscode.window.showTextDocument(doc);
                    // Opens the new file in the editor.

                    await commitAndPushTerraform(filePath);
                    // Commits and pushes the file to GitHub.

                    const webhookUrl = process.env.SLACK_WEBHOOK_URL || '';
                    // Gets the Slack webhook URL from environment variables.

                    console.log('Loaded webhook:', process.env.SLACK_WEBHOOK_URL);
                    // Logs the webhook URL.

                    if (webhookUrl) {
                        await sendSlackNotification(webhookUrl, `Terraform config for ${selected} saved to workspace.`);
                        // Sends a notification to Slack.
                    } else {
                        vscode.window.showWarningMessage('Slack webhook URL not set in environment.');
                        // Warns if the webhook URL is missing.
                    }
                } else {
                    vscode.window.showErrorMessage('No workspace folder open. Please open a folder in VS Code.');
                    // Error if no workspace is open.
                }
            }
        }
    });

    context.subscriptions.push(disposable, selectEnvDisposable);
    // Adds the commands to the extension context so they are cleaned up when the extension is deactivated.
}

export function deactivate() {}
// This function is called when your extension is deactivated. (Empty here)
```

---

## 2. src/terraform-generator.ts

Generates Terraform code for different Snowflake resources.

```typescript
export function generateTerraform(resource: string): string {
// Defines a function that takes a resource name and returns Terraform code.

    switch (resource) {
        case 'Database':
            return `
resource "snowflake_database" "example" {
  name = "EXAMPLE_DB"
}
`;
        // If the resource is 'Database', returns Terraform code for a Snowflake database.

        case 'Warehouse':
            return `
resource "snowflake_warehouse" "example" {
  name = "EXAMPLE_WH"
  size = "XSMALL"
}
`;
        // If the resource is 'Warehouse', returns Terraform code for a Snowflake warehouse.

        case 'Schema':
            return `
resource "snowflake_Schema" "example" {
  name = "EXAMPLE_SCHEMA"
}
`;
        // If the resource is 'Schema', returns Terraform code for a Snowflake Schema.

        default:
            return '';
        // If the resource is not recognized, returns an empty string.
    }
}
```

---

## 3. src/github-trigger.ts

Handles committing and pushing Terraform files to GitHub.

```typescript
import * as vscode from 'vscode';
// Imports VS Code API.

import { exec } from 'child_process';
// Imports Node.js exec function to run shell commands.

export async function triggerGitHubWorkflow(repo: string, workflow: string, token: string) {
    // Placeholder for a function to trigger GitHub Actions via API.
}

export async function commitAndPushTerraform(filePath: string): Promise<void> {
    // Defines a function to commit and push a file to GitHub.

    // TODO: Implement logic to commit and push file to GitHub using git CLI or GitHub API
    // For now, just show a message
    console.log(`Would commit and push: ${filePath}`);
    // Logs the file path that would be committed and pushed.

    // The following code is commented out. It shows how you could use git commands to add, commit, and push the file.
    /*
    // Get workspace folder
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('No workspace folder open. Cannot commit and push.');
        return;
    }
    const workspacePath = workspaceFolders[0].uri.fsPath;

    // Run git commands: add, commit, push
    exec(`git add "${filePath}"`, { cwd: workspacePath }, (err) => {
        if (err) {
            vscode.window.showErrorMessage('Git add failed: ' + err.message);
            return;
        }
        exec(`git commit -m "Add Terraform config for Snowflake resource"`, { cwd: workspacePath }, (err) => {
            if (err) {
                vscode.window.showErrorMessage('Git commit failed: ' + err.message);
                return;
            }
            exec(`git push`, { cwd: workspacePath }, (err) => {
                if (err) {
                    vscode.window.showErrorMessage('Git push failed: ' + err.message);
                } else {
                    vscode.window.showInformationMessage('Terraform config committed and pushed to GitHub!');
                }
            });
        });
    });
    */
}
```

---

## 4. src/slack.ts

Sends notifications to Slack using a webhook.

```typescript
import fetch from 'node-fetch';
// Imports node-fetch to make HTTP requests.

export async function sendSlackNotification(webhookUrl: string, message: string): Promise<void> {
// Defines a function to send a message to Slack.

    try {
        const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: message })
        });
        // Sends a POST request to the Slack webhook URL with the message.

        if (!res.ok) {
            throw new Error(`Slack notification failed: ${res.statusText}`);
            // Throws an error if the request failed.
        }
    } catch (err) {
        console.error(err);
        // Logs any errors that occur.
    }
}
```

---

## 5. templates/database.tf

A template for a Snowflake database Terraform resource.

```hcl
resource "snowflake_database" "example" {
  name = "EXAMPLE_DB"
}
```
- This is a Terraform configuration that creates a Snowflake database named `EXAMPLE_DB`.

---

## 6. database.tf

A generated Terraform file for a Snowflake database.

```hcl
resource "snowflake_database" "example" {
  name = "EXAMPLE_DB"
}
```
- Same as above, but this file is generated in the workspace when the user selects "Database".

---

## 7. .github/workflows/deploy.yml

GitHub Actions workflow to deploy Snowflake infrastructure.

```yaml
name: Deploy Snowflake Infra
# The name of the workflow.

on:
  push:
    paths:
      - '**/*.tf'
# Runs the workflow whenever a .tf file is pushed.

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      # Checks out the repository code.

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
      # Sets up Terraform CLI.

      - name: Terraform Init
        run: terraform init
      # Initializes Terraform.

      - name: Terraform Apply
        run: terraform apply -auto-approve
      # Applies the Terraform configuration automatically.
```

---

## 8. .env

Stores environment variables, such as the Slack webhook URL.

```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/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
```
- This variable is used to send notifications to Slack.

---

## 9. .gitignore

Specifies files and folders to ignore in Git.

```
.env
node_modules/
*.log
# ...and many more
```
- Prevents sensitive files and dependencies from being committed.

---

## 10. .gitattributes

Configures Git to handle line endings and text files.

```
* text=auto
```
- Ensures consistent line endings across platforms.

---

## 11. LICENSE

MIT License for open-source use.

```
MIT License
...
```
- Grants permission for anyone to use, modify, and distribute the code.

---

## 12. package.json

Describes the project and its dependencies.

```json
{
  "name": "snowflake-vscode-extension",
  "displayName": "Snowflake DataOps Assistant",
  "description": "VS Code extension to automate and manage Snowflake infrastructure using Terraform, GitHub Actions, and Slack.",
  "version": "0.1.0",
  "engines": {
    "vscode": "^1.80.0"
  },
  "categories": [
    "Other"
  ],
  "activationEvents": [
    "onCommand:snowflakeDataOps.activate"
  ],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "snowflakeDataOps.activate",
        "title": "Activate Snowflake DataOps Assistant"
      },
      {
        "command": "snowflakeDataOps.selectEnvFile",
        "title": "Select Environment File"
      }
    ]
  },
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ./",
    "watch": "tsc -w -p ./",
    "test": "npm run compile && node ./out/test/runTest.js"
  },
  "devDependencies": {
    "@types/node": "^24.1.0",
    "@types/vscode": "^1.80.0",
    "@vscode/test-electron": "^2.3.0",
    "typescript": "^5.0.0"
  },
  "dependencies": {
    "dotenv": "^17.2.1",
    "node-fetch": "^3.3.2"
  }
}
```
- Lists project metadata, commands, scripts, dependencies, and VS Code extension configuration.

---

## 13. tsconfig.json

TypeScript configuration for compiling the extension.

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2020",
    "outDir": "out",
    "lib": ["es2020"],
    "sourceMap": true,
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["vscode", "node"]
  },
  "exclude": ["node_modules", ".vscode-test"]
}
```
- Tells TypeScript how to compile your code and where to output the compiled files.

---

# Summary

This walkthrough explains every line and file in your Snowflake DataOps Assistant project. It’s designed for beginners to understand how Node.js, TypeScript, VS Code extensions, and supporting tools work together to automate Snowflake infrastructure management.

You can copy this file into your project as `CODE_EXPLANATION.md` for your team!