import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";

export class GetStudentAssignmentsBuilder {
    private driver: RESTfulAPIDriver;
    private studentId?: string;

    constructor(driver: RESTfulAPIDriver) {
        this.driver = driver
    }

    withStudentId(value: string) {
        this.studentId = value
        return this
    }

    async build() {
        const response = await this.driver.get(`/student/${this.studentId}/assignments`)

        return response
    }
}