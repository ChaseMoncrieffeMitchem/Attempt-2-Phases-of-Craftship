import { booleanCalc } from "./booleanCalc";


describe('boolean calculator', () => {
   
    // it("knows 'TRUE' returns true", () => {
    //     expect(booleanCalc.validate("TRUE")).toBeTruthy()
    // })

    // it("knows 'FALSE' returns false", () => {
    //     expect(booleanCalc.validate("FALSE")).toBeFalsy()
    // })

    // it("knows 'NOT TRUE' is false", () => {
    //     expect(booleanCalc.validate("NOT TRUE")).toBeFalsy()
    // })

    // it("knows 'NOT FALSE' is true", () => {
    //     expect(booleanCalc.validate("NOT FALSE")).toBeTruthy()
    // })

    // it("knows 'TRUE AND FALSE' returns false", () => {
    //     expect(booleanCalc.validate("TRUE AND FALSE")).toBeFalsy()
    // })

    // it("knows 'TRUE AND TRUE' returns true", () => {
    //     expect(booleanCalc.validate("TRUE AND TRUE")).toBeTruthy()
    // })

    // it("knows 'TRUE OR FALSE AND NOT FALSE' returns true", () => {
    //     expect(booleanCalc.validate("TRUE OR FALSE AND NOT FALSE")).toBeTruthy()
    // })

    // it("knows 'NOT TRUE AND TRUE OR FALSE OR FALSE' returns false", () => {
    //     expect(booleanCalc.validate("NOT TRUE AND TRUE OR FALSE OR FALSE")).toBeFalsy()
    // })

    it("knows 'TRUE OR TRUE OR TRUE AND FALSE' returns true", () => {
        expect(booleanCalc.validate("TRUE OR TRUE OR TRUE AND FALSE")).toBeTruthy()
    })

    // it("knows '(TRUE OR FALSE OR FALSE) AND TRUE' returns true", () => {
    //     expect(booleanCalc.validate("(TRUE OR FALSE OR FALSE) AND TRUE")).toBeTruthy()
    // })

})
