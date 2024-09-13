import { InvalidRequestBodyException } from "../shared/exceptions";
import { isMissingKeys } from "../shared/utils";
import { isUUID } from "../shared/utils";

class CreateStudentDTO {
    constructor(public name: string) {}

    static formRequest(body: unknown) {
        const requiredKeys = ["name"]
        const isRequestInvalid = !body || typeof body !== "object" || isMissingKeys(body, requiredKeys)

        if (isRequestInvalid) {
            throw new InvalidRequestBodyException(requiredKeys)
        }

        const { name } = body as { name: string }

        return new CreateStudentDTO(name)
    }
}

class StudentId {
    constructor(public id: string) {}

    static formRequestParams(params: unknown) {
        const areParamsInvalid = !params || typeof params !== "object" || "id" in params === false

        if (areParamsInvalid) {
            throw new InvalidRequestBodyException(["id"])
        }

        const { id } = params as { id: string }

        if (!isUUID(id)) {
            throw new InvalidRequestBodyException(["id"])
        }

        return new StudentId(id)
    }
}

export {CreateStudentDTO, StudentId}