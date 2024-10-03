Feature: Create a classroom

    As an Admin
    I want to Creat a classroom
    So that I can add students to it

    Scenario: Successfully created a classroom
        Given I want to create a classroom named "Math"
        When I request to create that classroom
        Then the class should be Successfully created

    Scenario: Failed to create a classroom 
        Given a classroom by name "(.*)" already exists
        When I request to create a classroom by that same name
        Then the classroom should not be created