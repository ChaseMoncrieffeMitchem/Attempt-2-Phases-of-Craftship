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
    // it("knows '00:00 - 23:59' is valid military time", () => {
    //     expect(militaryTime.validate("00:00 - 23:59")).toBeTruthy()
    // })

    // it("knows '00:03 - 16:59' is valid military time", () => {
    //     expect(militaryTime.validate("00:03 - 16:59")).toBeTruthy()
    // })

    // it("knows '00:80 - 16:59' is not valid military time", () => {
    //     expect(militaryTime.validate("00:80 - 16:59")).toBeFalsy()
    // })


})
