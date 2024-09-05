import { booleanCalc } from "./booleanCalc";


describe('boolean calculator', () => {
    it("knows 'TRUE' returns true", () => {
        expect(booleanCalc.validate("TRUE")).toBeTruthy()
    })
})
