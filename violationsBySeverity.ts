Then('I generate an Allure report with summarized violations by severity', async () => {
    // Read Axe results
    const axeResults = JSON.parse(fs.readFileSync('axe-results.json', 'utf8'));

    // Group violations by severity
    const summaryBySeverity: Record<string, any[]> = {
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

    // Add summarized details to Allure report
    for (const [severity, violations] of Object.entries(summaryBySeverity)) {
        if (violations.length > 0) {
            await browser.addAllureStep(
                `${severity.toUpperCase()} Violations`,
                JSON.stringify(violations, null, 2)
            );
        }
    }

    console.log('Accessibility violations summarized by severity in Allure report.');
});