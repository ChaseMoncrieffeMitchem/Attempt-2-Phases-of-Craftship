import { createClassDTO } from "../../../../src/shared/dtos/class/createClassDTO"

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }  

export class ClassBuilder {
    private classInput: createClassDTO
    private name: string = ""

    constructor() {
        this.classInput = {
            name: ''
        }
    }

    withName (value: string) {
    const randomInteger = getRandomNumber(100, 10000)
    this.classInput.name = `ClassName-${randomInteger}`
    return this
   }

   build(): createClassDTO {
    return {
        name: this.classInput.name
    }
   }
}