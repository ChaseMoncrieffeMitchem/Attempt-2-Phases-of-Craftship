import { isMissingKeys } from "@dddforum/shared/utils/utils";
import { InvalidEmailException, InvalidRequestBodyException } from "@dddforum/shared/errorsAndExceptions/exceptions";

export class CreateUserDTO {
    constructor(
        public email: string,
        public firstName: string,
        public lastName: string,
        public username: string,
        public password: string
    ) {}

    static formRequest(body: unknown) {
        const requiredKeys = ["email", "firstName", "lastName", "username", "password"];
        const isRequestInvalid = !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

        if (isRequestInvalid) {
            throw new InvalidRequestBodyException(requiredKeys);
        }
        
        const { email, firstName, lastName, username, password } = body as {
            email: string;
            firstName: string;
            lastName: string;
            username: string;
            password: string;
        };

        if (!email.includes('.com')) {
            throw new InvalidEmailException()
          }

        return new CreateUserDTO(email, firstName, lastName, username, password);
    }
}
