const handleNotOperation = (input: string) => {
    if (input === "NOT FALSE") return true
    if (input === "NOT TRUE") return false
}

const handleAndOperartion = (input: string) => {
    if (input === "TRUE AND TRUE") return true
}

const handleOperation = (input: string) => {

}

const handleInputInsideParanthesis = (input: string) => {

}

export class booleanCalc {
    public static validate(input: string) {
        const tokenize = input.split(" ")
        
        console.log(tokenize)

        if (input === "NOT TRUE" || input === "NOT FALSE") {
            return handleNotOperation(input)
        }

        if (input === "TRUE AND TRUE") {
            return handleAndOperartion(input)
        }

        return input === "TRUE"
    }
}