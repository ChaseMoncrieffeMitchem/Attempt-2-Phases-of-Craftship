import { statsCalculator } from "./statsCalculator";

describe('stats calculator', () => {

    describe("Identifying the smallest integer given an array of integers", () => {
        it.each([
            [[2, 4, 21, -8, 53, 40], -8],
            [[53, 88, 94, 70, 90, 100], 53],
            [[53, 88, 4, 2, 90, 1300], 2]
        ])("%s returns %s", (input: number[], result: number) => {
            let output = statsCalculator.validate(input)
            expect(output.minNum).toBe(result)
        })
    })

    describe("Identifying the biggest number given an array of integers", () => {
        it.each([
            [[2, 4, 21, -8, 53, 40], 53],
            [[53, 88, 94, 70, 90, 100], 100],
            [[53, 88, 4, 2, 90, 1300], 1300]
        ])("%s returns %s", (input: number[], result: number) => {
            let output = statsCalculator.validate(input)
            expect(output.maxNum).toBe(result)
        })
    })

    describe("Identifying the amount of integers in an array", () => {
        it.each([
            [[2, 4, 21, -8, 53, 40], 6],
            [[2, 4, 21, -8, 53], 5],
            [[2, 4, 21], 3]
        ])("%s returns %s", (input: number[], result: number) => {
            let output = statsCalculator.validate(input)
            expect(output.arrNum).toBe(result)
        })
    })

    describe("Identifying the average of an array of numbers", () => {
        it.each([
            [[2, 4, 21, -8, 53, 40], 18.666666666666668],
            [[53, 88, 94, 70, 90, 100], 82.5],
            [[53, 88, 4, 2, 90, 1300], 256.1666666666667]
        ])("%s returns %s", (input: number[], result: number) => {
            let output = statsCalculator.validate(input)
            expect(output.avgNum).toBe(result)
        })
    })

})
