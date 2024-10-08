Feature: Give an Assignement to a Student

    As an Admin
    I want to assign an assignment to a student
    So that the student will submit that Assignement

    Scenario: Successfully give Assignment to Student
        Given a student exists
        And an assignment exists
        When I request to assign that assignment to the student
        Then the student should be successfully assigned that Assignement