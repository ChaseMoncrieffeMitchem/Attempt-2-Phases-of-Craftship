

export function fizzbuzz (num: number): string {
    const isAMultipleOfThree = num % 3 === 0;
    const isAMultipleOfFive = num % 5 === 0;
    if (isNaN(num) || num > 100 || num < 0) return "Error"
    if (isAMultipleOfFive && isAMultipleOfThree) return "FizzBuzz"
    if (isAMultipleOfThree) return "Fizz"
    if (isAMultipleOfFive) return "Buzz"
    return num.toString()
}