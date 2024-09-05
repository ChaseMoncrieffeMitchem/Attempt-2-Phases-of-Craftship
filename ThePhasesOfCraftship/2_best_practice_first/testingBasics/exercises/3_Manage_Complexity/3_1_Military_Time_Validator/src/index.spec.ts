import { militaryTime } from "./militaryTime";


describe('military time validator', () => {

    it("knows '00:00 - 23:59' is valid military time", () => {
        expect(militaryTime.validate("00:00 - 23:59")).toBeTruthy()
    })
})
