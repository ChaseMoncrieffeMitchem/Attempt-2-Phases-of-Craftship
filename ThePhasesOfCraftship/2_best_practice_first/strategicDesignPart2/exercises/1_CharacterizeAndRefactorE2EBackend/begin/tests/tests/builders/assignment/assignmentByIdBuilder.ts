import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";

export class AssignmentByIdBuilder {
    private driver: RESTfulAPIDriver
    private assignmentId?: string

    constructor(driver: RESTfulAPIDriver) {
        this.driver = driver
    }

    withAssignmentId(value: string) {
        this.assignmentId = value
        return this
    }

    async build() {
        const response = await this.driver.get(`/assignments/${this.assignmentId}`)

        return response
    }
}