Then('I generate a professional Allure report summarizing violations by severity', async () => {
    // Read Axe results
    const axeResults = JSON.parse(fs.readFileSync('axe-results.json', 'utf8'));

    // Group violations by severity
    const summaryBySeverity: Record<string, { description: string; nodes: string[] }[]> = {
        critical: [],
        serious: [],
        moderate: [],
        minor: [],
    };

    for (const violation of axeResults.violations) {
        if (violation.impact && summaryBySeverity[violation.impact]) {
            summaryBySeverity[violation.impact].push({
                description: violation.description,
                nodes: violation.nodes.map((node) => node.target),
            });
        }
    }

    // Add a professional summary to Allure report
    for (const [severity, violations] of Object.entries(summaryBySeverity)) {
        if (violations.length > 0) {
            await browser.addAllureStep(
                `${severity.toUpperCase()} Violations`,
                `
                **Severity**: ${severity.toUpperCase()}
                **Total Violations**: ${violations.length}
                
                ${violations
                    .map((violation, index) => `
                        **Issue ${index + 1}:**
                        - **Description**: ${violation.description}
                        - **Affected Elements**: ${violation.nodes.join(', ')}
                    `)
                    .join('\n')}
                `
            );
        }
    }

    // Add a summary section
    const totalViolations = Object.values(summaryBySeverity).flat().length;
    const overallSummary = `
        **Accessibility Report Summary**
        - **Critical Violations**: ${summaryBySeverity.critical.length}
        - **Serious Violations**: ${summaryBySeverity.serious.length}
        - **Moderate Violations**: ${summaryBySeverity.moderate.length}
        - **Minor Violations**: ${summaryBySeverity.minor.length}
        - **Total Violations**: ${totalViolations}
    `;

    await browser.addAllureStep('Overall Summary', overallSummary);

    console.log('Professional accessibility report with detailed summary generated.');
});