export class statsCalculator {

    public static validate (input: number[]) {
        const smallestInteger = input.reduce((min, current) => current < min ? current : min)
        const biggestNumber = input.reduce((max, current) => current > max ? current : max)
        const quantityInArray = input.length
        const sumOfNumbers = input.reduce((sum, current) => sum + current, 0)
        const average = sumOfNumbers / input.length

        return {
            minNum: smallestInteger,
            maxNum: biggestNumber,
            arrNum: quantityInArray,
            avgNum: average
        }
    }

}
