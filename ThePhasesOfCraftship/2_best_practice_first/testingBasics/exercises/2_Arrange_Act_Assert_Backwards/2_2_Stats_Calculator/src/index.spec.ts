import { statsCalculator } from "./statsCalculator";

describe('stats calculator', () => {

    describe("Identifying the smallest integer given an array of integers", () => {
        it.each([
            [[2, 4, 21, -8, 53, 40], -8],
            [[53, 88, 94, 70, 90, 100], 53],
            [[53, 88, 4, 2, 90, 100], 2]
        ])("%s returns %s", (input: number[], result: number) => {
            let output = statsCalculator.validate(input)
            expect(output.minNum).toBe(result)
        })
    })
        // it("knows that '-8' is the smallest number in the array", () => {
        //     let output = statsCalculator.validate([2, 4, 21, -8, 53, 40])

        //     expect(output.minNum).toBe(-8)
        // })

    //     it("knows that '53' is the smallest number in the array", () => {
    //         let output = statsCalculator.validate([53, 88, 94, 70, 90, 100])

    //         expect(output.minNum).toBe(53)
    //     })

    //     it("knows that '2' is the smallest number in the array", () => {
    //         let output = statsCalculator.validate([53, 88, 4, 2, 90, 100])

    //         expect(output.minNum).toBe(2)
    // })

    // it("knows that '53' is the biggest number in the array", () => {
    //     let output = statsCalculator.validate([53])

    //     expect(output.maxNum).toBe(53)
    // })

    // it("knows '1' is the number of integers in the array", () => {
    //     let output = statsCalculator.validate([1])

    //     expect(output.arrNum).toBe(1)
    // })

})