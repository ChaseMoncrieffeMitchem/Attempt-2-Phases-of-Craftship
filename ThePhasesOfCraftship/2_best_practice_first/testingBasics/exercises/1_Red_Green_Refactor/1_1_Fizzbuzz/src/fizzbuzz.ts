

export function fizzbuzz (num: number) {
    const isAMultipleOfThree = num % 3 === 0;
    const isAMultipleOfFive = num % 5 === 0;
    if (num > 100) return "Error"
    if (num < 0) return "Error"
    if (isAMultipleOfFive && isAMultipleOfThree) return "FizzBuzz"
    if (isAMultipleOfThree) return "Fizz"
    if (isAMultipleOfFive) return "Buzz"
    return num.toString()
}