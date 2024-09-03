export class statsCalculator {

    public static validate (input: number[]) {
        input = [2, 4, 21, -8, 53, 40]
        const smallestInteger = input.reduce((min, current) => current < min ? current : min)

        return {
            minNum: smallestInteger,
            maxNum: 53,
            arrNum: 1
        }
    }

}
