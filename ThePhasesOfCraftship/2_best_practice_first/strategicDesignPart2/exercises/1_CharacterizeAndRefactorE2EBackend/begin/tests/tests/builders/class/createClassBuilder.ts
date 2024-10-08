import { createClassDTO } from "../../../../src/shared/dtos/class/createClassDTO"

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }  

export class ClassBuilder {
    private classInput: createClassDTO
    private name: string = ""
    private classId: string = ''

    constructor() {
        this.classInput = {
            name: '',
            classId: ''
        }
    }

    withName (value: string) {
    if (value !== "") return this
    const randomInteger = getRandomNumber(100, 10000)
    this.classInput.name = `ClassName-${randomInteger}`
    return this
   }

   withClassId(value: string) {
    this.classInput.classId = value;
    return this;
  }

   build(): createClassDTO {
    return {
        name: this.classInput.name,
        classId: this.classInput.classId
    }
   }
}