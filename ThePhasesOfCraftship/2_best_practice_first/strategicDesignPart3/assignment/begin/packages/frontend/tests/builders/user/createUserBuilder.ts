import { createUserDTO } from "../../../../shared/dtos/user/createUserDTO"

export class CreateUserInputBuilder {
    private createUserInput: createUserDTO

    constructor() {
        this.createUserInput = {
            firstName: "",
            lastName: "",
            email: "",
            username: "",
        }
    }

    public withFirstName(firstName: string) {
        this.createUserInput.firstName = firstName
        return this
    }

    public withLastName(lastName: string) {
        this.createUserInput.lastName = lastName
        return this
    }

    public withUsername(username: string) {
        this.createUserInput.username = username
        return this
    }

    public withEmail(email: string) {
        this.createUserInput.email = email
        return this
    }

    public async build() {
        const response = await this.driver("", {firstName: this.withFirstName, lastName: this.withLastName, username: this.withUsername, email: this.withEmail})

        console.log(response)

        return response
    }
}