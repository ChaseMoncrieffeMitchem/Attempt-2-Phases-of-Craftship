import { InvalidRequestBodyException } from "../shared/exceptions";

function isMissingKeys (data: any, keysToCheckFor: string[]) {
    for (let key of keysToCheckFor) {
      if (data[key] === undefined) return true;
    } 
    return false;
}

function isUUID (id: string) {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
}

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