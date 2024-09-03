import { statsCalculator } from "./statsCalculator";

describe('stats calculator', () => {

    it("knows that '-8' is the smallest number in the array", () => {
        let output = statsCalculator.validate([-8])

        expect(output.minNum).toBe(-8)
    })
})