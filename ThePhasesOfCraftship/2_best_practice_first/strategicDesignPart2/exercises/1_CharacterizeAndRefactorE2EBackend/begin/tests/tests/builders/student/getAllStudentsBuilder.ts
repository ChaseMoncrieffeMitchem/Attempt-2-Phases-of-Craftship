import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";

export class GetAllStudents {

    private driver: RESTfulAPIDriver;

    constructor(driver: RESTfulAPIDriver) {
        this.driver = driver
    }

    async build() {

        const response = await this.driver.get("/students")
        return response
    }
}