import { InvalidRequestBodyException, MissingReqBodyKey } from "shared/errorsAndExceptions/exceptions";
import { isMissingKeys } from "shared/utils/utils";

export class MarketingDTO {
    constructor(public email: string) {}

    static validate(data: any) {
        const keyIsMissing = isMissingKeys(data, ["email"]);

        if (keyIsMissing) {
            throw new MissingReqBodyKey
        }
    }

    static fromRequest(data: any): MarketingDTO {
        this.validate(data); // Perform validation
        return new MarketingDTO(data.email);
    }

}