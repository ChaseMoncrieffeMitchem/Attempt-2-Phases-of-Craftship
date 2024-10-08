Feature: Enroll a student inside of a classroom

    As an Admin
    I want to enroll a student inside of a classroom
    So that I can give them assignments

    Scenario: Successfully enrolled a Student into a Classroom
        Given an enrolled student exists with the studentId of "(.*)" and classId of "(.*)"
        When I request to enroll that student into that classroom
        Then that student should be enrolled in that classroom

    Scenario: Failed to enroll a Student inside of a Classroom
        Given the student is already enrolled in the same classroom
        When I request to enroll that student into that classroom
        Then the enrollment should not take place