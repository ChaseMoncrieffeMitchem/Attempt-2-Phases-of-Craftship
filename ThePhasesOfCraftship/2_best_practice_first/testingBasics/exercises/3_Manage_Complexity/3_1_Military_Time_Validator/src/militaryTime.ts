export class militaryTime {
    public static validate (input: string) {
        
        const leftHour = +input.split(":")[0]
        return leftHour <= 24
        

    }
}