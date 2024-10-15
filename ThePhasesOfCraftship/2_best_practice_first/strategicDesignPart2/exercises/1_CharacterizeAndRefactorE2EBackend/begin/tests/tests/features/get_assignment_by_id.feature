Feature: Get an Assignement by its assignmentID

    As an admin
    I want to retrieve and Assignement by its ID 
    So that I can see what class that assignment belongs to and if the student has completed that task (?)

    Scenario: Successfully retrieve assignment by ID
        Given assignments exist in the database
        When I request to retrieve the assignment by ID
        Then the assignment should be Successfully retrieved