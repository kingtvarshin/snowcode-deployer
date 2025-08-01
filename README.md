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
   \`git clone <your-repo-url>\`

2. **Install dependencies**  
   \`npm install\`

3. **Open in VS Code**  
   Open the folder in VS Code.

4. **Build the extension**  
   \`npm run compile\`

5. **Run and test**  
   Press \`F5\` in VS Code to launch a new Extension Development Host window.

6. **Edit and extend**  
   Modify files in \`src/\` to add features or change behavior.

## 📝 Next Steps

- Implement the logic in each file as described above.
- Add more Terraform templates in the \`templates/\` folder as needed.
- Connect your GitHub and Slack accounts for full automation.

## 🙋 Need help?

If you’re new to VS Code extension development, check out:
- [VS Code Extension API Docs](https://code.visualstudio.com/api)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Terraform Docs](https://www.terraform.io/docs)