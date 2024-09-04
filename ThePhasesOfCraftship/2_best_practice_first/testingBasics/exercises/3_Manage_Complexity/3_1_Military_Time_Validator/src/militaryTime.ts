export class militaryTime {
    public static validate (input: string) {
        const splitArray = input.split(" - ")
        const leftHour = +splitArray[0].split(":")[0]
        const rightHour = +splitArray[1].split(":")[0]
        console.log(leftHour, rightHour)
        if (leftHour < 24 && rightHour < 24) {
            return true
        }

    }
}