import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";

export class AssignmentsInClassBuilder {
    private driver: RESTfulAPIDriver;
    private classId?: string

    constructor(driver: RESTfulAPIDriver) {
        this.driver = driver
    }

    withClassId (value: string) {
        this.classId = value
        return this
    }

    async build() {
        const response = await this.driver.get(`/classes/${this.classId}/assignments`)

        console.log(response.text)

        return response
    }
}