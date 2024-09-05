const isValidTimeFormat = (input: string) => {
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!input.includes(" - ")) {
        return false
    }

    const [leftSide, rightSide] = input.split(" - ")

    return timePattern.test(leftSide) && timePattern.test(rightSide)
}


export class militaryTime {
    public static validate(input: string) {
        
        return isValidTimeFormat(input)
    }
}
