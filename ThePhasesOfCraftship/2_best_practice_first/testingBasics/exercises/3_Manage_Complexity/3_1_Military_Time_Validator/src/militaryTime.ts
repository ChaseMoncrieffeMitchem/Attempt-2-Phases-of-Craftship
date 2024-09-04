const isValidTimeFormat = (input: string) => {
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/
    return timePattern.test(input)
}

export class militaryTime {
    public static validate (input: string) {
        return isValidTimeFormat(input)
    }
}