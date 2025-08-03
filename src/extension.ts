import * as vscode from 'vscode';
import { generateTerraform } from './terraform-generator';
import * as path from 'path';
import * as fs from 'fs';
import { commitAndPushTerraform } from './github-trigger';
import { sendSlackNotification } from './slack';
import * as dotenv from 'dotenv';

let envFilePath: string | undefined;

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

export function activate(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage('Snowflake DataOps Assistant Activated!');

    // Command to select .env file
    const selectEnvDisposable = vscode.commands.registerCommand('snowflakeDataOps.selectEnvFile', async () => {
        const uri = await vscode.window.showOpenDialog({
            canSelectMany: false,
            filters: { 'Env Files': ['env'] },
            openLabel: 'Select .env file'
        });
        if (uri && uri[0]) {
            envFilePath = uri[0].fsPath;
            dotenv.config({ path: envFilePath, override: true }); // <--- override ensures new values are loaded
            vscode.window.showInformationMessage(`Loaded environment file: ${envFilePath}`);
            console.log('Loaded webhook:', process.env.SLACK_WEBHOOK_URL);
        }
    });

    // Register the command
    const disposable = vscode.commands.registerCommand('snowflakeDataOps.activate', async () => {
        const missing = checkWorkspaceSetup();
        if (missing.length > 0) {
            vscode.window.showErrorMessage(
                `Setup incomplete. Please add: ${missing.join(', ')}`
            );
            return;
        }

        if (!envFilePath) {
            envFilePath = path.join(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '', '.env');
            dotenv.config({ path: envFilePath });
        }

        // Dynamically get resources from templates
        const resources = getAvailableResources();
        const selected = await vscode.window.showQuickPick(resources, {
            placeHolder: 'Select a Snowflake resource to manage'
        });

        if (selected) {
            vscode.window.showInformationMessage(`Selected resource: ${selected}`);
            const tfConfig = generateTerraform(selected);
            if (tfConfig) {
                // Save to file in workspace root
                const workspaceFolders = vscode.workspace.workspaceFolders;
                if (workspaceFolders && workspaceFolders.length > 0) {
                    const filePath = path.join(workspaceFolders[0].uri.fsPath, `${selected.toLowerCase()}.tf`);
                    fs.writeFileSync(filePath, tfConfig, 'utf8');
                    vscode.window.showInformationMessage(`Terraform config saved to ${filePath}`);
                    const doc = await vscode.workspace.openTextDocument(filePath);
                    await vscode.window.showTextDocument(doc);
                    await commitAndPushTerraform(filePath);
                    const webhookUrl = process.env.SLACK_WEBHOOK_URL || '';
                    console.log('Loaded webhook:', process.env.SLACK_WEBHOOK_URL);
                    if (webhookUrl) {
                        await sendSlackNotification(webhookUrl, `Terraform config for ${selected} saved to workspace.`);
                    } else {
                        vscode.window.showWarningMessage('Slack webhook URL not set in environment.');
                    }
                } else {
                    vscode.window.showErrorMessage('No workspace folder open. Please open a folder in VS Code.');
                }
            }
        }
    });

    context.subscriptions.push(disposable, selectEnvDisposable);
}

export function deactivate() {}

function checkWorkspaceSetup(): string[] {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) return ['No workspace folder open.'];
    const root = workspaceFolders[0].uri.fsPath;
    const requiredFiles = [
        '.env',
        'provider.tf',
        'variables.tf',
        'terraform.tfvars'
    ];
    const missing: string[] = [];
    for (const file of requiredFiles) {
        if (!fs.existsSync(path.join(root, file))) {
            missing.push(file);
        }
    }
    if (!process.env.SLACK_WEBHOOK_URL) {
        missing.push('SLACK_WEBHOOK_URL in .env');
    }
    return missing;
}

function getAvailableResources(): string[] {
    const templatesDir = path.join(__dirname, '..', 'templates');
    if (!fs.existsSync(templatesDir)) return [];
    return fs.readdirSync(templatesDir)
        .filter(file => file.endsWith('.tf'))
        .map(file => path.basename(file, '.tf'))
        .map(name => name.charAt(0).toUpperCase() + name.slice(1)); // Capitalize for display
}