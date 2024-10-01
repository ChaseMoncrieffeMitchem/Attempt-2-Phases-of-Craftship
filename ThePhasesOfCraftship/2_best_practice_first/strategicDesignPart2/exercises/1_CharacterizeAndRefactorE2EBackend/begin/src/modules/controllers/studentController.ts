import express, { Request, Response } from 'express';
import { Database } from '../../shared/persistence/database';

const Errors = {
    ValidationError: 'ValidationError',
    StudentNotFound: 'StudentNotFound',
    ClassNotFound: 'ClassNotFound',
    AssignmentNotFound: 'AssignmentNotFound',
    ServerError: 'ServerError',
    ClientError: 'ClientError',
    StudentAlreadyEnrolled: 'StudentAlreadyEnrolled'
  }

function isMissingKeys (data: any, keysToCheckFor: string[]) {
    for (let key of keysToCheckFor) {
      if (data[key] === undefined) return true;
    } 
    return false;
}

function parseForResponse(data: unknown) {
    return JSON.parse(JSON.stringify(data));
}

function isUUID (id: string) {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
}

export class StudentController {
    
    constructor(private database: Database) {

    }

    async createStudent (req: Request, res: Response) {
        try {
            let dbConnection = await this.database.getConnection()       
            if (isMissingKeys(req.body, ['name', 'email'])) {
                return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
            }
    
            const { name, email } = req.body;
    
            const student = await dbConnection.student.create({
                data: {
                    name,
                    email            
                }
            });
    
            res.status(201).json({ error: undefined, data: parseForResponse(student), success: true });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
        }
    }

    

    async mergeStudentWithAssignment(req: Request, res: Response) {
        try {
            if (isMissingKeys(req.body, ['studentId', 'assignmentId'])) {
                return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
            }

            const { studentId, assignmentId } = req.body;

            const dbConnection = await this.database.getConnection(); // Get the database connection

            // Check if student exists
            const student = await dbConnection.student.findUnique({
                where: {
                    id: studentId
                }
            });

            if (!student) {
                return res.status(404).json({ error: Errors.StudentNotFound, data: undefined, success: false });
            }

            // Check if assignment exists
            const assignment = await dbConnection.assignment.findUnique({
                where: {
                    id: assignmentId
                }
            });

            if (!assignment) {
                return res.status(404).json({ error: Errors.AssignmentNotFound, data: undefined, success: false });
            }

            const studentAssignment = await dbConnection.studentAssignment.create({
                data: {
                    studentId,
                    assignmentId,
                }
            });

            res.status(201).json({ error: undefined, data: parseForResponse(studentAssignment), success: true });
        } catch (error) {
            console.log(error); // Optional: Log the error for debugging
            res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
        }
    }

    async getAllStudents(req: Request, res: Response) {
        try {
            const dbConnection = await this.database.getConnection(); // Get the database connection
            
            const students = await dbConnection.student.findMany({
                include: {
                    classes: true,
                    assignments: true,
                    reportCards: true
                }, 
                orderBy: {
                    name: 'asc'
                }
            });
            
            res.status(200).json({ error: undefined, data: parseForResponse(students), success: true });
        } catch (error) {
            console.log(error); // Optional: Log the error for debugging
            res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
        }
    }

    async getStudentById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!isUUID(id)) {
                return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
            }
            
            const dbConnection = await this.database.getConnection(); // Get the database connection
            
            const student = await dbConnection.student.findUnique({
                where: {
                    id
                },
                include: {
                    classes: true,
                    assignments: true,
                    reportCards: true
                }
            });

            if (!student) {
                return res.status(404).json({ error: Errors.StudentNotFound, data: undefined, success: false });
            }

            res.status(200).json({ error: undefined, data: parseForResponse(student), success: true });
        } catch (error) {
            console.log(error); // Optional: Log the error for debugging
            res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
        }
    }

    async getAllSubmittedAssignments(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!isUUID(id)) {
                return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
            }

            const dbConnection = await this.database.getConnection(); // Get the database connection

            // Check if student exists
            const student = await dbConnection.student.findUnique({
                where: {
                    id
                }
            });

            if (!student) {
                return res.status(404).json({ error: Errors.StudentNotFound, data: undefined, success: false });
            }

            const studentAssignments = await dbConnection.studentAssignment.findMany({
                where: {
                    studentId: id,
                    status: 'submitted'
                },
                include: {
                    assignment: true
                },
            });

            res.status(200).json({ error: undefined, data: parseForResponse(studentAssignments), success: true });
        } catch (error) {
            console.log(error); // Optional: Log the error for debugging
            res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
        }
    }

    async getAllGrades(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!isUUID(id)) {
                return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
            }

            const dbConnection = await this.database.getConnection(); // Get the database connection

            // Check if student exists
            const student = await dbConnection.student.findUnique({
                where: {
                    id
                }
            });

            if (!student) {
                return res.status(404).json({ error: Errors.StudentNotFound, data: undefined, success: false });
            }

            const studentAssignments = await dbConnection.studentAssignment.findMany({
                where: {
                    studentId: id,
                    status: 'submitted',
                    grade: {
                        not: null
                    }
                },
                include: {
                    assignment: true
                },
            });
        
            res.status(200).json({ error: undefined, data: parseForResponse(studentAssignments), success: true });
        } catch (error) {
            console.log(error); // Optional: Log the error for debugging
            res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
        }
    }
}

// // POST student created
// export const createStudentControllerFactory = (database: Database) => {
    
// } 

// // POST student assigned to class
// export const createClassEnrollmentControllerFactory = (database: Database) => {
//     return async (req: Request, res: Response) => {
//         try {
//             const dbConnection = await database.getConnection();

//             if (isMissingKeys(req.body, ['studentId', 'classId'])) {
//                 return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
//             }

//             const { studentId, classId } = req.body;

//             // check if student exists
//             const student = await dbConnection.student.findUnique({
//                 where: {
//                     id: studentId
//                 }
//             });

//             if (!student) {
//                 return res.status(404).json({ error: Errors.StudentNotFound, data: undefined, success: false });
//             }

//             // check if class exists
//             const cls = await dbConnection.class.findUnique({
//                 where: {
//                     id: classId
//                 }
//             });

//             if (!cls) {
//                 return res.status(404).json({ error: Errors.ClassNotFound, data: undefined, success: false });
//             }

//             // check if student is already enrolled in class
//             const duplicatedClassEnrollment = await dbConnection.classEnrollment.findFirst({
//                 where: {
//                     studentId,
//                     classId
//                 }
//             });

//             if (duplicatedClassEnrollment) {
//                 return res.status(400).json({ error: Errors.StudentAlreadyEnrolled, data: undefined, success: false });
//             }

//             const classEnrollment = await dbConnection.classEnrollment.create({
//                 data: {
//                     studentId,
//                     classId
//                 }
//             });

//             res.status(201).json({ error: undefined, data: parseForResponse(classEnrollment), success: true });
//         } catch (error) {
//             console.log(error);
//             res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
//         }
//     };
// };



// // POST assignment created
// export const createAssignmentControllerFactory = (database: Database) => {
//     return async (req: Request, res: Response) => {
//         try {
//             if (isMissingKeys(req.body, ['classId', 'title'])) {
//                 return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
//             }

//             const { classId, title } = req.body;

//             const dbConnection = await database.getConnection(); // Get the database connection

//             const assignment = await dbConnection.assignment.create({
//                 data: {
//                     classId,
//                     title
//                 }
//             });

//             res.status(201).json({ error: undefined, data: parseForResponse(assignment), success: true });
//         } catch (error) {
//             console.log(error); // Optional: Log the error for debugging
//             res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
//         }
//     };
// };




// // POST student assigned to assignment
// export const createMergeStudentWithAssignmentControllerFactory = (database: Database) => {
//     return async (req: Request, res: Response) => {
//         try {
//             if (isMissingKeys(req.body, ['studentId', 'assignmentId'])) {
//                 return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
//             }

//             const { studentId, assignmentId } = req.body;

//             const dbConnection = await database.getConnection(); // Get the database connection

//             // check if student exists
//             const student = await dbConnection.student.findUnique({
//                 where: {
//                     id: studentId
//                 }
//             });

//             if (!student) {
//                 return res.status(404).json({ error: Errors.StudentNotFound, data: undefined, success: false });
//             }

//             // check if assignment exists
//             const assignment = await dbConnection.assignment.findUnique({
//                 where: {
//                     id: assignmentId
//                 }
//             });

//             if (!assignment) {
//                 return res.status(404).json({ error: Errors.AssignmentNotFound, data: undefined, success: false });
//             }

//             const studentAssignment = await dbConnection.studentAssignment.create({
//                 data: {
//                     studentId,
//                     assignmentId,
//                 }
//             });

//             res.status(201).json({ error: undefined, data: parseForResponse(studentAssignment), success: true });
//         } catch (error) {
//             console.log(error); // Optional: Log the error for debugging
//             res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
//         }
//     };
// };





// // POST student submitted assignment
// export const createMergeStudentAssignmentWithSubmissionStatusControllerFactory = (database: Database) => {
//     return async (req: Request, res: Response) => {
//         try {
//             if (isMissingKeys(req.body, ['assignmentId', 'studentId'])) {
//                 return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
//             }

//             const { studentId, assignmentId } = req.body;

//             const dbConnection = await database.getConnection(); // Get the database connection
            
//             // check if student assignment exists
//             const studentAssignment = await dbConnection.studentAssignment.findUnique({
//                 where: {
//                     studentId_assignmentId: {
//                         assignmentId,
//                         studentId
//                     }
//                 }
//             });

//             if (!studentAssignment) {
//                 return res.status(404).json({ error: Errors.AssignmentNotFound, data: undefined, success: false });
//             }

//             const studentAssignmentUpdated = await dbConnection.studentAssignment.update({
//                 where: {
//                     studentId_assignmentId: {
//                         assignmentId,
//                         studentId
//                     }
//                 },
//                 data: {
//                     status: 'submitted'
//                 }
//             });

//             res.status(200).json({ error: undefined, data: parseForResponse(studentAssignmentUpdated), success: true });
//         } catch (error) {
//             console.log(error); // Optional: Log the error for debugging
//             res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
//         }
//     };
// };



// // POST create Class
// export const createClassControllerFactory = (database: Database) => {
//     return async (req: Request, res: Response) => {
//         try {
//             if (isMissingKeys(req.body, ['name'])) {
//                 return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
//             }
    
//             const { name } = req.body;
    
//             const dbConnection = await database.getConnection(); // Get the database connection
            
//             const cls = await dbConnection.class.create({
//                 data: {
//                     name
//                 }
//             });
    
//             res.status(201).json({ error: undefined, data: parseForResponse(cls), success: true });
//         } catch (error) {
//             console.log(error); // Optional: Log the error for debugging
//             res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
//         }
//     };
// };


// // Post merge assignment with grade
// export const mergeSubmittedAssignmentWithGradeControllerFactory = (database: Database) => {
//     return async (req: Request, res: Response) => {
//         try {
//             if (isMissingKeys(req.body, ['studentId', 'assignmentId', 'grade'])) {
//                 return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
//             }
    
//             const { assignmentId, studentId, grade } = req.body;
    
//             // Validate grade
//             if (!['A', 'B', 'C', 'D'].includes(grade)) {
//                 return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
//             }
            
//             const dbConnection = await database.getConnection(); // Get the database connection
            
//             // Check if student assignment exists
//             const studentAssignment = await dbConnection.studentAssignment.findUnique({
//                 where: {
//                     studentId_assignmentId: {
//                         assignmentId,
//                         studentId
//                     }
//                 }
//             });
    
//             if (!studentAssignment) {
//                 return res.status(404).json({ error: Errors.AssignmentNotFound, data: undefined, success: false });
//             }
    
//             const studentAssignmentUpdated = await dbConnection.studentAssignment.update({
//                 where: {
//                     studentId_assignmentId: {
//                         assignmentId,
//                         studentId
//                     }
//                 },
//                 data: {
//                     grade,
//                 }
//             });
    
//             res.status(200).json({ error: undefined, data: parseForResponse(studentAssignmentUpdated), success: true });
//         } catch (error) {
//             res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
//         }
//     };
// };



// // GET all students
// export const getAllStudentsControllerFactory = (database: Database) => {
//     return async (req: Request, res: Response) => {
//         try {
//             const dbConnection = await database.getConnection(); // Get the database connection
            
//             const students = await dbConnection.student.findMany({
//                 include: {
//                     classes: true,
//                     assignments: true,
//                     reportCards: true
//                 }, 
//                 orderBy: {
//                     name: 'asc'
//                 }
//             });
            
//             res.status(200).json({ error: undefined, data: parseForResponse(students), success: true });
//         } catch (error) {
//             res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
//         }
//     };
// };



// // GET a student by id
// export const getStudentByIdControllerFactory = (database: Database) => {
//     return async (req: Request, res: Response) => {
//         try {
//             const { id } = req.params;
//             if (!isUUID(id)) {
//                 return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
//             }
            
//             const dbConnection = await database.getConnection(); // Get the database connection
            
//             const student = await dbConnection.student.findUnique({
//                 where: {
//                     id
//                 },
//                 include: {
//                     classes: true,
//                     assignments: true,
//                     reportCards: true
//                 }
//             });

//             if (!student) {
//                 return res.status(404).json({ error: Errors.StudentNotFound, data: undefined, success: false });
//             }

//             res.status(200).json({ error: undefined, data: parseForResponse(student), success: true });
//         } catch (error) {
//             res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
//         }
//     };
// };



// // GET assignment by id
// export const getAssignmentByIdControllerFactory = (database: Database) => {
//     return async (req: Request, res: Response) => {
//         try {
//             const { id } = req.params;
//             if (!isUUID(id)) {
//                 return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
//             }
            
//             const dbConnection = await database.getConnection(); // Get the database connection
            
//             const assignment = await dbConnection.assignment.findUnique({
//                 include: {
//                     class: true,
//                     studentTasks: true
//                 },
//                 where: {
//                     id
//                 }
//             });

//             if (!assignment) {
//                 return res.status(404).json({ error: Errors.AssignmentNotFound, data: undefined, success: false });
//             }

//             res.status(200).json({ error: undefined, data: parseForResponse(assignment), success: true });
//         } catch (error) {
//             res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
//         }
//     };
// };



// // GET all assignments for class
// export const findAllAssignmentsAllClassesControllerFactory = (database: Database) => {
//     return async (req: Request, res: Response) => {
//         try {
//             const { id } = req.params;
//             if (!isUUID(id)) {
//                 return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
//             }

//             const dbConnection = await database.getConnection(); // Get the database connection

//             // Check if class exists
//             const cls = await dbConnection.class.findUnique({
//                 where: {
//                     id
//                 }
//             });

//             if (!cls) {
//                 return res.status(404).json({ error: Errors.ClassNotFound, data: undefined, success: false });
//             }

//             const assignments = await dbConnection.assignment.findMany({
//                 where: {
//                     classId: id
//                 },
//                 include: {
//                     class: true,
//                     studentTasks: true
//                 }
//             });

//             res.status(200).json({ error: undefined, data: parseForResponse(assignments), success: true });
//         } catch (error) {
//             res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
//         }
//     };
// };



// // GET all student submitted assignments
// export const getAllSubmittedAssignmentsControllerFactory = (database: Database) => {
//     return async (req: Request, res: Response) => {
//         try {
//             const { id } = req.params;
//             if (!isUUID(id)) {
//                 return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
//             }

//             const dbConnection = await database.getConnection(); // Get the database connection

//             // Check if student exists
//             const student = await dbConnection.student.findUnique({
//                 where: {
//                     id
//                 }
//             });

//             if (!student) {
//                 return res.status(404).json({ error: Errors.StudentNotFound, data: undefined, success: false });
//             }

//             const studentAssignments = await dbConnection.studentAssignment.findMany({
//                 where: {
//                     studentId: id,
//                     status: 'submitted'
//                 },
//                 include: {
//                     assignment: true
//                 },
//             });

//             res.status(200).json({ error: undefined, data: parseForResponse(studentAssignments), success: true });
//         } catch (error) {
//             res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
//         }
//     };
// };



// // GET all student grades
// export const getAllGradesControllerFactory = (database: Database) => {
//     return async (req: Request, res: Response) => {
//         try {
//             const { id } = req.params;
//             if (!isUUID(id)) {
//                 return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
//             }

//             const dbConnection = await database.getConnection(); // Get the database connection

//             // Check if student exists
//             const student = await dbConnection.student.findUnique({
//                 where: {
//                     id
//                 }
//             });

//             if (!student) {
//                 return res.status(404).json({ error: Errors.StudentNotFound, data: undefined, success: false });
//             }

//             const studentAssignments = await dbConnection.studentAssignment.findMany({
//                 where: {
//                     studentId: id,
//                     status: 'submitted',
//                     grade: {
//                         not: null
//                     }
//                 },
//                 include: {
//                     assignment: true
//                 },
//             });
        
//             res.status(200).json({ error: undefined, data: parseForResponse(studentAssignments), success: true });
//         } catch (error) {
//             res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
//         }
//     };
// };
