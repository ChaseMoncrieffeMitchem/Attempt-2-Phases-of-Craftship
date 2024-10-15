Feature: Get all of the students grades

    As an admin
    I want to get all of the grades that belong to one student
    So that I can check on their grades

    Scenario: Successfully retrieve student grades
        Given a student has grades in the database
        When I request to retrieve those grades
        Then I should see all of the grades for that student