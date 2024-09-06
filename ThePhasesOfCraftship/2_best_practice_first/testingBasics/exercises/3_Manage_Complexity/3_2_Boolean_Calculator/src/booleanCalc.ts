const handleNotOperation = (input: string) => {
    if (input === "FALSE") return "TRUE"
    if (input === "TRUE") return "FALSE"
}

const handleAndOperation = (input: string) => {
    if (input === "TRUE AND TRUE") return "TRUE"
    if (input === "TRUE AND FALSE") return "FALSE"
    if (input === "FALSE AND TRUE") return "FALSE"
}

const handleOrOperation = (input: string) => {
    if (input === "TRUE OR FALSE") return "TRUE"
    if (input === "TRUE OR TRUE") return "TRUE"
    if (input === "FALSE OR TRUE") return "TRUE"
    if (input === "FALSE OR FALSE") return "FALSE"
}

const notIsHandled = (input: string) => { // DOING WHAT IS SUPPOSED TO
    const split = input.split(" NOT ")
    console.log(split)
    const stringWithNotCalculated = split[0] + ` ${handleNotOperation(split[1])}`
    console.log(stringWithNotCalculated)
    return stringWithNotCalculated
}

const andIsHandled = (input: string) => {
    // const handledInput = notIsHandled(input);
    const split = input.split(" ")
    console.log(split)
    let splitArr = []

    for (let i = 0; i < split.length; ++i) { // ASK GPT TO refactor down to unconditonal statements
        
        if (split[i] === "AND") {
            splitArr.push(split[i - 1], split[i], split[i + 1])
            break;
        }
       
    }

    const andHandled = splitArr.join(" ")
    console.log(andHandled)
    const stringWithAndTransformed = handleAndOperation(andHandled)
    console.log(stringWithAndTransformed)

    const andIndex = input.indexOf(andHandled) + andHandled.length;
    const remainingString = input.slice(andIndex).trim();
    console.log(remainingString)

    const finalArray = [ // Not dynamic so likely will not work w other test
        input.split(" ")[0],
        input.split(" ")[1],
        input.split(" ")[2],
        input.split(" ")[3],
        stringWithAndTransformed
    ]

    console.log(finalArray) 
    return finalArray.join(" ")
}



const orIsHandled = (input: string) => {
    const x = input.split(" ")
    console.log(x)

    let splitArr = []

    for (let i = 0; i < x.length; ++i) {
        if (x[i] === "OR") {
            splitArr.push(x[i - 1], x[i], x[i + 1])
        }
    }

    const t = handleOrOperation(splitArr.join(" "))
    return t
}

const handleInputInsideParanthesis = (input: string) => {

}

export class booleanCalc {
    public static validate(input: string) { // FIrst thing first is take in an input and go straight to the NOT functions to be handled, then pass that result down to AND to be handled, and pass that result down to OR to be handled
        console.log(andIsHandled(input))
        const goingToOr = andIsHandled(input)
        console.log(orIsHandled(goingToOr))

        if(input.includes("NOT")) {
            notIsHandled(input)
        }
        if(!input.includes("NOT")) {
            andIsHandled(input)
        }

        // if (notIsHandled(input).includes("AND")) {
            
        //     console.log(handleAndOperation(stringWithAnds))
        // }

        // const tokenize = input.split(" ")
        
        // if (tokenize.includes("NOT")) {
        //     const notHandled = handleNotOperation(input)
        //     return notHandled
        // }

        // if (tokenize.includes("AND")) {
        //     const andHandled = handleAndOperation(input)
        //     return andHandled
        // }

        // if (tokenize.includes("OR")) {
        //     const orHandled = handleOrOperation(input)
        //     return orHandled
        // }

        // if (input === "NOT TRUE" || input === "NOT FALSE") {
        //     return handleNotOperation(input)
        // }

        // if (input === "TRUE AND TRUE") {
        //     return handleAndOperation(input)
        // }

        return orIsHandled(input) === "TRUE"
    }
}