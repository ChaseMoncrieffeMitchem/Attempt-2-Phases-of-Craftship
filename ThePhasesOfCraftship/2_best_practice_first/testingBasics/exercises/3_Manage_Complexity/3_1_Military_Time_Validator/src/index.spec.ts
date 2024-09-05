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

    describe("Checking is time format is valid", () => {
        it.each([
            ["00:00 23:59", false],
            ["a00:00 - 23:59", false],
            ["00:000 - 00:00", false],
            ["0000 - 0001", false]
        ])("knows '%s' returns %s", (input: string, result: boolean) => {
            expect(militaryTime.validate(input)).toBe(result)
        })
    })

    it("knows '05:00 - 03:00' is not valid military time range", () => {
        expect(militaryTime.validate('05:00 - 03:00')).toBeFalsy()
    })

    it("knows '23:59 - 03:59' is not valid military time range", () => {
        expect(militaryTime.validate('23:59 - 03:59')).toBeFalsy()
    })

})
