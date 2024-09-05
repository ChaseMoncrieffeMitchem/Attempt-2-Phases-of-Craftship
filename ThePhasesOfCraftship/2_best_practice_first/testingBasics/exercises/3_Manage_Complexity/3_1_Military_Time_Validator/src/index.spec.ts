import { militaryTime } from "./militaryTime";


describe('military time validator', () => {

    describe("Checking that time range is within valid military time range", () => {
        it.each([
            ["00:00 - 23:59", true],
            ["00:03 - 16:59", true],
            ["00:80 - 16:59", false]
        ])("knows '%s' returns %s", (input: string, result: boolean) => {
            expect(militaryTime.validate(input)).toBe(result)
        })
    })

    it("knows '00:00 23:59' is not a valid time format", () => {
        expect(militaryTime.validate("00:00 23:59")).toBeFalsy()
    })

})
