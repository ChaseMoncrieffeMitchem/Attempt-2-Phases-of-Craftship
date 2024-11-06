import { InvalidRequestBodyException } from "../../errorsAndExceptions/exceptions";
import { isMissingKeys } from "../../utils/utils";

export class MarketingDTO {
    constructor(public email: string) {}

    static validate(data: any) {
        const keyIsMissing = isMissingKeys(data, ["email"]);

        if (keyIsMissing) {
            throw new InvalidRequestBodyException(["email"])
        }
    }

    static fromRequest(data: any): MarketingDTO {
        this.validate(data); // Perform validation
        return new MarketingDTO(data.email);
    }

}