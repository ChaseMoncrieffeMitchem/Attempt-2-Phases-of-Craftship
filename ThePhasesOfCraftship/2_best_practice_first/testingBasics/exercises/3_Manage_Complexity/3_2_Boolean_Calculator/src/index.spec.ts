import { booleanCalc } from "./booleanCalc";


describe('boolean calculator', () => {
   
    it("knows 'TRUE' returns true", () => {
        expect(booleanCalc.validate("TRUE")).toBeTruthy()
    })

    it("knows 'FALSE' returns false", () => {
        expect(booleanCalc.validate("FALSE")).toBeFalsy()
    })

    it("knows 'NOT TRUE' is false", () => {
        expect(booleanCalc.validate("NOT TRUE")).toBeFalsy()
    })

    it("knows 'NOT FALSE' is true", () => {
        expect(booleanCalc.validate("NOT FALSE")).toBeTruthy()
    })

})
