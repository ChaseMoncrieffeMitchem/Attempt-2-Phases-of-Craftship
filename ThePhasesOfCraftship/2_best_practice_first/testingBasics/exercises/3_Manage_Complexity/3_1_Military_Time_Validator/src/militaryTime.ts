const isValidTimeFormat = (input: string) => {
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const [leftSide, rightSide] = input.split(" - ")

    if (!input.includes(" - ")) {
        return false
    }

    if (+leftSide.split(":")[0] > +rightSide.split(":")[0]) {
        return false
    }
    

    return timePattern.test(leftSide) && timePattern.test(rightSide)
}


export class militaryTime {
    public static validate(input: string) {
        
        return isValidTimeFormat(input)
    }
}

