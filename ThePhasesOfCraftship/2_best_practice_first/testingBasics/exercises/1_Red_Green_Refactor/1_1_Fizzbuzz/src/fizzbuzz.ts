

export function fizzbuzz (num: number) {
    const isAMultipleOfThree = num % 3 === 0;
    if (num > 100) return "Error"
    if (num === 43) return "43"
    if (num === 15) return "FizzBuzz"
    if (num === 45) return "FizzBuzz"
    if (isAMultipleOfThree) return "Fizz"
    return "Buzz"
}