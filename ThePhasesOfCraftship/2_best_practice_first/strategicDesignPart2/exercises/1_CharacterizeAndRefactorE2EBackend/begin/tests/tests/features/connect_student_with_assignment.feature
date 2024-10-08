Feature: Give an Assignement to a Student

    As an Admin
    I want to assign an assignment to a student
    So that the student will submit that Assignement

    Scenario: Successfully give Assignment to Student
        Given a student exists
        And an assignment exists
        When I request to assign that assignment to the student
        Then the student should be successfully assigned that Assignement

    Scenario: Failed to give an Assignment to Student b/c assignment Does Not Exist
        Given an assignment Does not exist
        When I request to assign that non-assignment to the student
        Then the student should not be assigned that Assignement