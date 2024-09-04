import { militaryTime } from "./militaryTime";


describe('military time validator', () => {

    it("knows '25:00 - 12:23' is NOT valid military time because left side goes over '24:00'", () => {
        let output = militaryTime.validate("25:00 - 12:23")

        expect(output).toBeFalsy()
    })

    // it("knows '22:00 - 26:23' is NOT valid military time because right side goes over '24:00'", () => {
    //     let output = militaryTime.validate("22:00 - 26:23")

    //     expect(output).toBeFalsy()
    // })

})
