import express from 'express';

import cors from 'cors';
import { classEnrollmentController, createAssignmentController, createClassController, createStudentController, findAllAssignmentsAllClassesController, getAllGradesController, getAllStudentsController, getAllSubmittedAssignmentsController, getAssignmentByIdController, getStudentByIdController, mergeStudentAssignmentWithSubmissionStatusController, mergeStudentWithAssignmentController, mergeSubmittedAssignmentWithGradeController } from './modules/controllers/studentController';

const app = express();
app.use(express.json());
app.use(cors());



// API Endpoints




// POST student assignment graded



app.post('/students', createStudentController);
app.post('/classes', createClassController);
app.post('/class-enrollments', classEnrollmentController);
app.post('/assignments', createAssignmentController);
app.post('/student-assignments', mergeStudentWithAssignmentController);
app.post('/student-assignments/submit', mergeStudentAssignmentWithSubmissionStatusController);
app.post('/student-assignments/grade', mergeSubmittedAssignmentWithGradeController);
app.get('/students', getAllStudentsController);
app.get('/students/:id', getStudentByIdController);
app.get('/assignments/:id', getAssignmentByIdController
);
app.get('/classes/:id/assignments', findAllAssignmentsAllClassesController);
app.get('/student/:id/assignments', getAllSubmittedAssignmentsController);
app.get('/student/:id/grades', getAllGradesController)


const port = process.env.PORT || 3000;

const http = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { http }