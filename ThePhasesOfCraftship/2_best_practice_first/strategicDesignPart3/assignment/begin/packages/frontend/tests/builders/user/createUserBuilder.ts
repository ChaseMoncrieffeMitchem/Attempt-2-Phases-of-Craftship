import { createUserDTO } from "@dddforum/shared/dtos/user/createUserDTO"

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

export class CreateUserInputBuilder {
    private createUserInput: createUserDTO
    // private driver: RESTfulAPIDriver

    constructor(
        // driver: RESTfulAPIDriver
    ) {
        this.createUserInput = {
            firstName: "",
            lastName: "",
            email: "",
            username: "",
        }
        // this.driver = driver
    }

    public withFirstName(firstName: string) {
        if (firstName) {
            this.createUserInput.firstName = firstName;
        } else {
            this.createUserInput.firstName = `firstName-${getRandomNumber(1, 10000)}`;
        }
        return this;
    }

    public withLastName(lastName: string) {
        if (lastName) {
            this.createUserInput.lastName = lastName;
        } else {
            this.createUserInput.lastName = `lastName-${getRandomNumber(1, 10000)}`;
        }
        return this;
    }

    public withUsername(username: string) {
        if (username) {
            this.createUserInput.username = username;
        } else {
            this.createUserInput.username = `username-${getRandomNumber(1, 10000)}`;
        }
        return this;
    }

    public withEmail(email: string) {
        if (email) {
            this.createUserInput.email = email;
        } else {
            this.createUserInput.email = `email-${getRandomNumber(1, 10000)}@gmail.com`;
        }
        return this;
    }

    public build() {
        // const response = await this.driver("/users/new", {firstName: this.withFirstName, lastName: this.withLastName, username: this.withUsername, email: this.withEmail})

        // console.log(response)

        return this.createUserInput
    }
}