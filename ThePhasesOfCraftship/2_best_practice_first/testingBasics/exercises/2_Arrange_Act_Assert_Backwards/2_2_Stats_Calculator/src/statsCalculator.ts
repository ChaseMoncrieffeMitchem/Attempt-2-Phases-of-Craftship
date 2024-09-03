export class statsCalculator {

    public static validate (input: number[]) {
        const smallestInteger = input.reduce((min, current) => current < min ? current : min)

        return {
            minNum: smallestInteger,
            // maxNum: 53,
            // arrNum: 1
        }
    }

}
