Feature: Accessibility Scan for Amazon Cart

  As a tester
  I want to scan the Amazon cart page for accessibility issues
  So that I can identify and fix any violations for a better user experience

  Background:
    Given I am on the Amazon homepage

  Scenario: Add products to the cart and scan for accessibility issues
    When I search and add "laptop" to the cart
    And I search and add "headphones" to the cart
    And I navigate to the cart page
    Then I perform an accessibility scan on the cart page
    And I generate an accessibility report with violations grouped by severity
    And I include screenshots with highlighted UI elements in the report