export class militaryTime {
    public static validate (input: string) {
        const timeArray = input.split(" - ")
        const leftSideArray = timeArray[0]
        const hourLeftSideArray = leftSideArray.split(":")[0]
    
        if (+hourLeftSideArray > 24) return false
        

    }
}