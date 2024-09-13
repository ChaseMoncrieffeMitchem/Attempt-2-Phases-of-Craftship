class InvalidRequestBodyException extends Error {
    constructor(missingKeys: string[]) {
        super("Body is missing required key: " + missingKeys.join(", "))
    }
}

class StudentNotFoundException extends Error {
    constructor() {
        super("Student not found")
    }
}

class ClassNotFoundException extends Error {
    constructor(classId: string) {
        super("Class not found")
    }
}

class StudentAlreadyEnrolledException extends Error {
    constructor() {
        super("Student already Enrolled")
    }
}

class AssignmentDoesNotExist extends Error {
    constructor() {
        super("Assignment does not exist")
    }
}

class GradeNotValid extends Error {
    constructor() {
        super("Grade is not valid")
    }
}



export { InvalidRequestBodyException, StudentNotFoundException, ClassNotFoundException, StudentAlreadyEnrolledException, AssignmentDoesNotExist, GradeNotValid }