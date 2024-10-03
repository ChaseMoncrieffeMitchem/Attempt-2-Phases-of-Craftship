Feature: Create Student

    As an Admin
    I want to Create a Student
    So that they can be added to a classroom

    Scenario: Successfully created a Student
        Given I want to create a student named "Chase"
        When I request to create that student
        Then the student should be Successfully created

    Scenario: Failed to create a student due to a duplicate entry
        Given a student named "Alina" already exists
        When I request to create another student with the same name
        Then the creation should fail
        And I should receive an error message saying "Student already exists"
