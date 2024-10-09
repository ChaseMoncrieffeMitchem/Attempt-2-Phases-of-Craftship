Feature: Get a grade on an Assignement

    As I Teacher
    I want to receive an assignement from the Student
    So that I can grade it

    Scenario: Successfully have Assignment Graded
        Given an assignment has been submitted
        When I make a request to grade that assignment
        Then the assignment should be successfully graded