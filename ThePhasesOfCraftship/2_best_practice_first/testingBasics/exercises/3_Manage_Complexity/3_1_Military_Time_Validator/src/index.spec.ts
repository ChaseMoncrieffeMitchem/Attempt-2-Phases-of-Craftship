import { militaryTime } from "./militaryTime";


describe('military time validator', () => {

    it("knows '25:00 - 12:23' is NOT valid military time because left side goes over '24:00'", () => {
        let output = militaryTime.validate("25:00 - 12:23")

        expect(output).toBeFalsy()
    })

    it("knows '22:00 - 26:23' is NOT valid military time because right side goes over '24:00'", () => {
        let output = militaryTime.validate("22:00 - 26:23")

        expect(output).toBeFalsy()
    })

    it("knows '22:00 - 22:78' is NOT valid military time because right side minutes go over '00:59'", () => {
        let output = militaryTime.validate("22:00 - 22:78")

        expect(output).toBeFalsy()
    })

    it("knows '00:00 - 23:59' is a valid military time", () => {
        let output = militaryTime.validate("00:00 - 23:59")

        expect(output).toBeTruthy()
    })

})
