import { createAssignmentDTO } from "../../../../src/shared/dtos/assignment/create_assignmentDTO";
import { createClassDTO } from "../../../../src/shared/dtos/class/createClassDTO";
import { createStudentDTO } from "../../../../src/shared/dtos/student/createStudentDTO";
import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
import { assignmentBuilder } from "../assignment/createAssignment Builder";
import { StudentBuilder } from "../student/createStudentBuilder";
import { ClassBuilder } from "./createClassBuilder";

export class ClassRoomBuilder {
    private studentInput: createStudentDTO[] = [];
    private classInput: createClassDTO | null = null;
    private assignments: createAssignmentDTO[] = [];
    private students: createStudentDTO[] = [];
    private driver: RESTfulAPIDriver;

    constructor(driver: RESTfulAPIDriver) {
        this.driver = driver
    }

    // Add student to a class 
    withStudent(studentBuilder: StudentBuilder) {
        const student = studentBuilder.build()
        this.students.push(student)
        return this
    }

    // Set the class input
    withClass(classBuilder: ClassBuilder) {
        this.classInput = classBuilder.build();
        return this;
    }

    // Assign assignments to students
    withAssignmentsAssignedToAllStudents(assignments: assignmentBuilder[]) {
        this.assignments = assignments.map(builder => builder.build());
        return this;
    }

    // Build and make API requests to create the class, students, and assignments

    async build() {
        // Create Class
        const classResponse = await this.driver.post('/classes', this.classInput);
        const classId = classResponse.body.data?.id;

        // Create Students
        const studentPromises = this.students.map(student => this.driver.post('/students', student));
        const studentResponses = await Promise.all(studentPromises);
        const studentIds = studentResponses.map(response => response.body.data?.id);

        // Create Assignments
        const assignmentPromises = this.assignments.map(assignment => {
            const assignmentWithClassId = { ...assignment, classId };
            return this.driver.post('/assignments', assignmentWithClassId);
        });
        const assignmentResponses = await Promise.all(assignmentPromises);
        const assignmentIds = assignmentResponses.map(response => response.body.data?.id);

        // Assign each assignment to each student
        const studentAssignmentPromises = studentIds.flatMap(studentId => 
            assignmentIds.map(assignmentId => 
                this.driver.post('/student-assignments', { studentId, assignmentId })
            )
        );
        await Promise.all(studentAssignmentPromises);

        return {
            classId,
            studentIds,
            assignmentIds,
        };
    }
}