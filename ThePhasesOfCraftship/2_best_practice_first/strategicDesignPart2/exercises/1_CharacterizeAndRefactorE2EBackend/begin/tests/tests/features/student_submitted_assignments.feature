Feature: Get all of the student submitted assignments

    As an admin
    I want to get all of assigments that have been submitted by a student
    So that I can check all the students submitted assigments

    Scenario: Successfully retrieve student assignments by studentId
        Given students have assignments belonging to them
        When I request to retrieve those student assignments
        Then I should see all of the assignments for that student