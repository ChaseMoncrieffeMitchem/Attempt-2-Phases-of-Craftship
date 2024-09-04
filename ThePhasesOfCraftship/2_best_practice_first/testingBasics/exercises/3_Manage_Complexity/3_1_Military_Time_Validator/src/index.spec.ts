import { militaryTime } from "./militaryTime";


describe('military time validator', () => {

    it("knows '25:00 - 12:23' is NOT valid military time because it goes over '24:00'", () => {
        let output = militaryTime.validate("25:00 - 12:23")
        
        expect(output.result).toBeFalsy()
    })

})
