# Snowflake DataOps Assistant (VS Code Extension)

## 🚀 What is this?

This is a Visual Studio Code extension that helps Data Engineers automate and manage their Snowflake infrastructure using Terraform. It integrates with Slack for alerts, GitHub Actions for CI/CD, and Snowflake (using a free trial account).

## 🧩 How does it work?

**Typical workflow:**
1. You launch the extension in VS Code.
2. You choose a Snowflake resource (like a database or warehouse) to provision.
3. The extension generates Terraform configuration files for your selection.
4. It commits and pushes these files to your GitHub repository.
5. GitHub Actions automatically deploys the Terraform code to provision Snowflake infrastructure.
6. Slack receives a notification about the deployment status.

## 📁 Project Structure

\`\`\`
snowflake-vscode-extension/
├── src/
│   ├── extension.ts                  # Main VS Code extension logic
│   ├── terraform-generator.ts        # Generates Terraform files
│   ├── github-trigger.ts             # Calls GitHub Actions via API
│   └── slack.ts                      # Sends Slack webhooks
├── templates/
│   └── database.tf                   # Terraform templates
├── .github/workflows/
│   └── deploy_snowflake_infra.yml    # GitHub Action to apply Terraform
├── package.json                      # Project metadata and dependencies
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # Project documentation
\`\`\`

## 📦 What does each file do?

- **src/extension.ts**  
  Entry point for your extension. Registers commands and UI in VS Code.

- **src/terraform-generator.ts**  
  Contains logic to generate Terraform configuration files based on user input.

- **src/github-trigger.ts**  
  Handles triggering GitHub Actions workflows via API calls.

- **src/slack.ts**  
  Sends notifications to Slack channels using webhooks.

- **templates/database.tf**  
  Example Terraform template for provisioning a Snowflake database.

- **.github/workflows/deploy.yml**  
  GitHub Actions workflow file that runs Terraform to deploy infrastructure when changes are pushed.

- **package.json**  
  Describes your extension, lists dependencies, and defines commands/scripts.

- **tsconfig.json**  
  Configures TypeScript for compiling your extension code.

- **README.md**  
  This documentation file.

## 🛠️ How do I use or develop this extension?

1. **Clone the repository**  
   `git clone <your-repo-url>`

2. **Install dependencies**  
   `npm install`

3. **Open in VS Code**  
   Open the folder in VS Code.

4. **Build the extension**  
   `npm run compile`

5. **Select your environment file**  
   - Open the Command Palette (`Ctrl+Shift+P`), type `Select Environment File`, and choose your `.env` file.
   - This allows you to use different environment configurations (such as Slack webhook URLs) without changing code.

6. **Run and test**  
   - Press `F5` in VS Code to launch a new Extension Development Host window.
   - Open the Command Palette (`Ctrl+Shift+P`), type “Activate Snowflake DataOps Assistant”, and run it.
   - Select a Snowflake resource to manage.
   - The extension will generate a Terraform config file, save it to your workspace, and (optionally) send a Slack notification.

7. **Edit and extend**  
   - Modify files in `src/` to add features or change behavior.
   - Use the Command Palette to select different `.env` files as needed.

---

## 🚀 How to Deploy and Install the Extension

1. **Build the Extension**
   ```sh
   npm install
   npm run compile
   ```

2. **Test Locally (Development Mode)**
   - Press `F5` in VS Code.
   - This launches a new Extension Development Host window for testing.

3. **Package the Extension**
   - Install VSCE if you haven't:
     ```sh
     npm install -g vsce
     ```
   - Package your extension:
     ```sh
     vsce package
     ```
   - This creates a `.vsix` file in your project folder.

4. **Install the Packaged Extension**
   - In VS Code, open the Command Palette (`Ctrl+Shift+P`).
   - Type `Extensions: Install from VSIX...`
   - Select your `.vsix` file to install.

5. **(Optional) Publish to the Marketplace**
   - Follow [VS Code publishing docs](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) to publish your extension for others to use.

---

**Summary:**  
- Build and test with `F5`.
- Package with `vsce package`.
- Install with `Extensions: Install from VSIX...`.
- (Optional)

---

## 🛠️ Development Steps & Reference

### 1. Create a feature branch
```sh
git checkout -b feature/extension-bootstrap
```
- Start all new work in a feature branch for better code management and collaboration.

### 2. Implement extension activation and command registration
- Edited `src/extension.ts` to register the `snowflakeDataOps.activate` command.
- The command shows a message when triggered, confirming the extension is active.

### 3. Scaffold resource selection UI
- Added a Quick Pick menu in `src/extension.ts` for selecting Snowflake resources (`Database`, `Warehouse`, `Schema`).
- This lets users choose which resource to manage.

### 4. Generate Terraform configuration
- Created `src/terraform-generator.ts` to generate Terraform code for the selected resource.
- Integrated the `generateTerraform` function in the command handler to produce the correct config.

### 5. Save generated Terraform config to workspace
- Used Node.js `fs` and `path` modules to write the generated config as `<resource>.tf` in the workspace root.
- Automatically opens the new file in VS Code for review.

### 6. Scaffold commit and push to GitHub
- Created `src/github-trigger.ts` with a placeholder `commitAndPushTerraform` function.
- Called this function after saving the Terraform file, preparing for future automation of git operations.

### 7. Compile TypeScript code
```sh
npm run compile
```
- This generates the `out/extension.js` file required by VS Code.

### 8. Run and test the extension
- Press `F5` in VS Code to launch the Extension Development Host.
- Open the Command Palette (`Ctrl+Shift+P`), type “Activate Snowflake DataOps Assistant”, and run it.
- Confirm that the message and resource selection UI appear, and that the Terraform file is generated and opened.

### 9. Automate commit and push to GitHub
- Implemented `commitAndPushTerraform` in `src/github-trigger.ts` to run `git add`, `git commit`, and `git push` for the generated Terraform file.
- This enables automatic deployment triggers via GitHub Actions.

### 10. Send Slack notifications
- Created `src/slack.ts` to send messages to a Slack channel using a webhook.
- Called `sendSlackNotification` after saving the Terraform file to notify about the action.

### 11. Allow users to select an environment file via the extension UI
- Added a new command (`snowflakeDataOps.selectEnvFile`) to let users pick a `.env` file using a file picker dialog in VS Code.
- The selected `.env` file is loaded using `dotenv.config({ path })`, making its environment variables available to the extension.
- If the user does not select a file, the extension tries to load `.env` from the workspace root by default.
- This makes it easy to switch between different environment configurations without editing code.

**How to use:**
1. Run the command "Select Environment File" from the Command Palette.
2. Pick your desired `.env` file.
3. The extension will use variables from the selected file (e.g., `SLACK_WEBHOOK_URL`).

**Tip:**  
Keep your `.env` files out of version control by adding `.env` to your `.gitignore`.

---

## ### Workspace Setup Checklist

Before using the extension, ensure your workspace contains:
- `.env` file with `SLACK_WEBHOOK_URL`
- `provider.tf` with Snowflake provider configuration
- `variables.tf` defining required variables
- `terraform.tfvars` with your Snowflake credentials and region

The extension will check for these files and variables before allowing you to create Snowflake resources.

---

_Add each new step here as you build more features!_
