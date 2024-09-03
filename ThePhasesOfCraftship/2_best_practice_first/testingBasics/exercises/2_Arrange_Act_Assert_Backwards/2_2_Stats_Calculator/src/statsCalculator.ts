export class statsCalculator {

    public static validate (input: number[]) {
        const smallestInteger = input.reduce((min, current) => current < min ? current : min)
        const biggestNumber = input.reduce((max, current) => current > max ? current : max)

        return {
            minNum: smallestInteger,
            maxNum: biggestNumber,
            // arrNum: 1
        }
    }

}
