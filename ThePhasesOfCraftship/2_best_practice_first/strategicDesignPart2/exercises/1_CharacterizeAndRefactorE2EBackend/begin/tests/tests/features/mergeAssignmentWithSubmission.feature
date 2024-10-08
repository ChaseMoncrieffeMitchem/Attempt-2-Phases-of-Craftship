Feature: Student Submits assignment

    As a Student
    I want to sumbit an assignment
    So that I can get a grade on that assignment

    Scenario: Successfully submitted an assignment
        Given an assignment has been given to a student
        When I make a request to Submit that assignment
        Then the assignment should be given a successful submission status
