Feature: Pull up all of the assignemts avaialable in one class

    As an admin
    I want to retrieve all assignments that belong to a class

    Scenario: Successfully retrieve all assignemts in a class
        Given assignments exist in a class
        When I request to retrieve a class by its ID 
        Then I should see all of the assignments in that class