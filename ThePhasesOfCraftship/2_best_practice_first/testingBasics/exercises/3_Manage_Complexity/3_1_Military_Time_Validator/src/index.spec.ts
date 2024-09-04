import { militaryTime } from "./militaryTime";


describe('military time validator', () => {

    it("knows '00:00' is a valid time format", () => {
        expect(militaryTime.validate("00:00")).toBe(true)
    })

})
