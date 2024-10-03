Feature: Create an assignment

    As an admin 
    I want to Create an assignment
    So that I can give that assignment to a student

    Scenario: Successfully created a assignment
        Given I want to create a assignment titled "(.*)"
        When I request to create that assignment
        Then the assignment should be Successfully created

    Scenario: Failed to create a assignment 
        Given a assignment by title "(.*)" already exists
        When I request to create a assignment by that same title
        Then the assignment should not be created