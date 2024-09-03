import { statsCalculator } from "./statsCalculator";

describe('stats calculator', () => {

    it("knows that '-8' is the smallest number in the array", () => {
        let output = statsCalculator.validate([2, 4, 21, -8, 53, 40])

        expect(output.minNum).toBe(-8)
    })

    // it("knows that '53' is the biggest number in the array", () => {
    //     let output = statsCalculator.validate([53])

    //     expect(output.maxNum).toBe(53)
    // })

    // it("knows '1' is the number of integers in the array", () => {
    //     let output = statsCalculator.validate([1])

    //     expect(output.arrNum).toBe(1)
    // })

})