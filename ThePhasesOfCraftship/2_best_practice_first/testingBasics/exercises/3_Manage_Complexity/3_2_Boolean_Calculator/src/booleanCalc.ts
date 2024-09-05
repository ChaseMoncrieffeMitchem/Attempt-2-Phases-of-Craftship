const handleNotOperation = (input: string) => {
    if (input === "NOT FALSE") return true
    if (input === "NOT TRUE") return false
}

const handleAndOperartion = (input: string) => {
    if (input === "TRUE AND TRUE") return true
}

export class booleanCalc {
    public static validate(input: string) {
        if (input === "NOT TRUE" || input === "NOT FALSE") {
            return handleNotOperation(input)
        }

        if (input === "TRUE AND TRUE") {
            return handleAndOperartion(input)
        }

        return input === "TRUE"
    }
}