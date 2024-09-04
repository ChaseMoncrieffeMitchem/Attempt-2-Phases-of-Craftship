import { militaryTime } from "./militaryTime";


describe('military time validator', () => {

    it("knows '00:00' is a valid time format", () => {
        expect(militaryTime.validate("00:00")).toBe(true)
    })

    it("knows '000:00' is not a valid time format", () => {
        expect(militaryTime.validate("000:00")).toBe(false)
    })

    it("knows '00:0' is not a valid time format", () => {
        expect(militaryTime.validate("00:0")).toBeFalsy()
    })

    it("knows '00:00 00:00' is not a valid time range", () => {
        expect(militaryTime.validate("00:00 00:00")).toBeFalsy()
    })

})
