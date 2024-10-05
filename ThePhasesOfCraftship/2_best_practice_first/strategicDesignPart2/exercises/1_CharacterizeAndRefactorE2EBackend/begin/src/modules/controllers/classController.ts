import express, { Request, Response } from "express";
import { Database } from "../../shared/persistence/database";

const Errors = {
  ValidationError: "ValidationError",
  StudentNotFound: "StudentNotFound",
  ClassNotFound: "ClassNotFound",
  AssignmentNotFound: "AssignmentNotFound",
  ServerError: "ServerError",
  ClientError: "ClientError",
  StudentAlreadyEnrolled: "StudentAlreadyEnrolled",
};

function isMissingKeys(data: any, keysToCheckFor: string[]) {
  for (let key of keysToCheckFor) {
    if (data[key] === undefined) return true;
  }
  return false;
}

function parseForResponse(data: unknown) {
  return JSON.parse(JSON.stringify(data));
}

function isUUID(id: string) {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    id
  );
}

export class ClassController {
  constructor(private database: Database) {}

  async createClass(req: Request, res: Response) {
    try {
      let dbConnection = await this.database.getConnection(); // Get the database connection
      if (isMissingKeys(req.body, ["name"])) {
        return res
          .status(400)
          .json({
            error: Errors.ValidationError,
            data: undefined,
            success: false,
          });
      }

      const { name } = req.body;

      const cls = await dbConnection.class.create({
        data: {
          name,
        },
      });

      res.status(201).json({
        error: undefined,
        data: {
          ...parseForResponse(cls), // Keep the existing data from cls
          id: cls.id, // Add the id if it's not already there
        },
        success: true,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: Errors.ServerError, data: undefined, success: false });
    }
  }

  async mergeStudentWithClass(req: Request, res: Response) {
    try {
      const dbConnection = await this.database.getConnection();

      if (isMissingKeys(req.body, ["studentId", "classId"])) {
        return res
          .status(400)
          .json({
            error: Errors.ValidationError,
            data: undefined,
            success: false,
          });
      }

      const { studentId, classId } = req.body;

      // check if student exists
      const student = await dbConnection.student.findUnique({
        where: {
          id: studentId,
        },
      });

      if (!student) {
        return res
          .status(404)
          .json({
            error: Errors.StudentNotFound,
            data: undefined,
            success: false,
          });
      }

      // check if class exists
      const cls = await dbConnection.class.findUnique({
        where: {
          id: classId,
        },
      });

      if (!cls) {
        return res
          .status(404)
          .json({
            error: Errors.ClassNotFound,
            data: undefined,
            success: false,
          });
      }

      // check if student is already enrolled in class
      const duplicatedClassEnrollment =
        await dbConnection.classEnrollment.findFirst({
          where: {
            studentId,
            classId,
          },
        });

      if (duplicatedClassEnrollment) {
        return res
          .status(400)
          .json({
            error: Errors.StudentAlreadyEnrolled,
            data: undefined,
            success: false,
          });
      }

      const classEnrollment = await dbConnection.classEnrollment.create({
        data: {
          studentId,
          classId,
        },
      });

      res
        .status(201)
        .json({
          error: undefined,
          data: parseForResponse(classEnrollment),
          success: true,
        });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: Errors.ServerError, data: undefined, success: false });
    }
  }

  async findAllAssignmentsForClass(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!isUUID(id)) {
        return res
          .status(400)
          .json({
            error: Errors.ValidationError,
            data: undefined,
            success: false,
          });
      }

      const dbConnection = await this.database.getConnection(); // Get the database connection

      // Check if class exists
      const cls = await dbConnection.class.findUnique({
        where: {
          id,
        },
      });

      if (!cls) {
        return res
          .status(404)
          .json({
            error: Errors.ClassNotFound,
            data: undefined,
            success: false,
          });
      }

      const assignments = await dbConnection.assignment.findMany({
        where: {
          classId: id,
        },
        include: {
          class: true,
          studentTasks: true,
        },
      });

      res
        .status(200)
        .json({
          error: undefined,
          data: parseForResponse(assignments),
          success: true,
        });
    } catch (error) {
      console.log(error); // Optional: Log the error for debugging
      res
        .status(500)
        .json({ error: Errors.ServerError, data: undefined, success: false });
    }
  }
}
