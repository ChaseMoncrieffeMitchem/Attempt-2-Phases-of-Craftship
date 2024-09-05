const handleNotOperation = (input: string) => {
    if (input === "NOT FALSE") return true
    if (input === "NOT TRUE") return false
}

export class booleanCalc {
    public static validate(input: string) {
        if (input === "NOT TRUE" || input === "NOT FALSE") {
            return handleNotOperation(input)
        }

        return input === "TRUE"
    }
}