import { Given, When, Then } from '@wdio/cucumber-framework';
import AxeBuilder from '@axe-core/webdriverio';
import fs from 'fs';

// Scenario: Scan accessibility for Amazon cart page with products
Given('I have added products to the Amazon cart', async () => {
    await browser.url('https://www.amazon.com/gp/cart/view.html');
    // You may add logic to add items to the cart here, if needed.
});

When('I perform an accessibility scan using Axe', async () => {
    const results = await new AxeBuilder({ driver: browser }).analyze();

    // Save the results to a JSON file for report generation
    fs.writeFileSync('axe-results.json', JSON.stringify(results, null, 2));
});

Then('I generate an Allure report with highlighted issues', async () => {
    // Read Axe results
    const axeResults = JSON.parse(fs.readFileSync('axe-results.json', 'utf8'));

    // Highlight issues on the UI
    for (const violation of axeResults.violations) {
        for (const node of violation.nodes) {
            await browser.execute((element) => {
                element.style.border = '5px solid red'; // Highlight with a red border
            }, await $(node.target[0]));
        }
    }

    // Add details to Allure report
    const violationDetails = axeResults.violations.map((violation) => ({
        description: violation.description,
        impact: violation.impact,
        tags: violation.tags,
        nodes: violation.nodes.map((node) => node.target),
    }));

    await browser.addAllureStep('Accessibility Violations', JSON.stringify(violationDetails, null, 2));
    console.log('Accessibility report generated.');
});