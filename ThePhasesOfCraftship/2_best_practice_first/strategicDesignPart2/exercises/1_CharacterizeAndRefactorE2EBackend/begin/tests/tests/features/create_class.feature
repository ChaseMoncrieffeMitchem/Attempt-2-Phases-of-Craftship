Feature: Create a classroom

    As an Admin
    I want to Creat a classroom
    So that I can add students to it

    Scenario: Successfully created a classroom
        Given I want to create a classroom named "Math"
        When I request to create that classroom
        Then the class should be Successfully created