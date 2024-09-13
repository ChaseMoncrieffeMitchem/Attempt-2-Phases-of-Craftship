import { InvalidRequestBodyException } from "../shared/exceptions";
import { isMissingKeys } from "../shared/utils";

class CreateClassDTO {
    constructor(public name: string) {}

    static formRequest(body: unknown) {
        const requiredKeys = ["name"]
        const isRequestInvalid = !body || typeof body !== "object" || isMissingKeys(body, requiredKeys)

        if (isRequestInvalid) {
            throw new InvalidRequestBodyException(requiredKeys)
        }

        const { name } = body as { name: string }

        return new CreateClassDTO(name)
    }
}

class EnrollStudentDTO {
    constructor(public studentId: string, public classId: string) {}

    static formRequest(body: unknown) {
        const requiredKeys = ["studentId", "classId"]
        const isRequestInvalid = !body || typeof body !== "object" || isMissingKeys(body, requiredKeys)

        if (isRequestInvalid) {
            throw new InvalidRequestBodyException(requiredKeys)
        }

        const { studentId, classId } = body as { studentId: string, classId: string}

        return new EnrollStudentDTO(studentId, classId)
    }
}

class ClassId {
    constructor(public id: string) {}

    static formRequestParams(params: unknown) {
        const areParamsInvalid = !params || typeof params !== "object" || "id" in params === false

        if (areParamsInvalid) {
            throw new InvalidRequestBodyException(["id"])
        }

        const { id } = params as { id: string }

        return new ClassId(id)
    }
}

export {CreateClassDTO, EnrollStudentDTO, ClassId}