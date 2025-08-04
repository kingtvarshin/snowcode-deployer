import * as fs from 'fs';
import * as path from 'path';

export function generateTerraform(resource: string, params: Record<string, string> = {}): string {
    const templatePath = path.join(__dirname, '..', 'templates', `${resource.toLowerCase()}.tf`);
    if (fs.existsSync(templatePath)) {
        let template = fs.readFileSync(templatePath, 'utf8');
        // Replace placeholders in the template with params
        Object.entries(params).forEach(([key, value]) => {
            template = template.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value);
        });
        return template;
    }
    return `Template for resource '${resource}' not found at path '${templatePath}'.`;
}