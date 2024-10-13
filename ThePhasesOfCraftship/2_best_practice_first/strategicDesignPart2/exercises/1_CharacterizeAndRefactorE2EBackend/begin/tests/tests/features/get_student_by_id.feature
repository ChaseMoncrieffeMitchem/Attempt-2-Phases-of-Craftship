Feature: Pull up one student by their Student inside

    As an admin
    I want to retrieve a student by their StudentID
    So that I can see their classrooms assignments and grades

    Scenario: Successfully retrieve a student by StudentID
        Given students exist in the database
        When I make a request to get a student by their StudentID
        Then that student should be retrieved by their StudentID


