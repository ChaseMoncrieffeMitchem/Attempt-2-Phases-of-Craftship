Feature: Pull up all students in the database

    As an admin
    I want to pull up all students that exists in the school
    So that I can see what classrooms and assignments and grades they have

    Scenario: Successfully pull all students in the database
        Given students exist in the database
        When I request to pull those students by their studentIds
        Then the student should be Successfully created