// 🔘 I have implemented the minimum requirements listed in the project description
// 🔘 I have Programmed By Wishful Thinking, designing the response API before it was actually created 
// 🔘 I have Worked Backwards, starting at the Assert, then going to the Act and the Arrange
// 🔘 I have tests that validate the following statements 
// "maxwell1_c" returns a false-y response because of a lack of uppercase characters
// "maxwellTheBe" returns a false-y response because of a lack of digits
// "thePhysical1234567" returns a false-y response because of exceeding the 15 character length
// 🔘 Once I have made the aforementioned tests pass, I have refactored my test specifications to use it.each() to perform parameterization if there is sufficient duplication (see Tip #3 here)
// 🔘 There is no duplication in my test code or my production code
import exp from "constants";
import { passwordValidator } from "./passwordValidator";


describe('password validator', () => {

  describe('checking between 5 and 15 characters long', () => {
    it.each([
      ["Mommy5", true, []],
      ["Mom5", false, ["InvalidLength"]],
      ["MomTheStar123456", false, ["InvalidLength"]]
    ])('knows that "%s" should return %s', (input: string, result: boolean, errors: string[]) => {
      let output = passwordValidator.validate(input)

      expect(output.result).toBe(result)
      expect(output.errors).toHaveLength(errors.length)
      expect(output.errors).toStrictEqual(errors)
    })
  })

  it("knows that 'Daddy2' does have at least one digit", () => {
    let output = passwordValidator.validate("Daddy2")

    expect(output.result).toBe(true)
    expect(output.errors).toHaveLength(0)
  })

  it("knows that 'Daddy' does NOT have at least one digit", () => {
    let output = passwordValidator.validate("Daddy")

    expect(output.result).toBe(false)
    expect(output.errors).toHaveLength(1)
    expect(output.errors).toStrictEqual(["NoDigitIncluded"])
  })

  it("knows that 'Brother1' contains at least one uppercase letter", () => {
    let output = passwordValidator.validate("Brother1")

    expect(output.result).toBe(true)
    expect(output.errors).toHaveLength(0)
  })

  it("knows that 'brother4' does NOT contain at least one uppercase letter", () => {
    let output = passwordValidator.validate("brother4")

    expect(output.result).toBe(false)
    expect(output.errors).toHaveLength(1)
    expect(output.errors).toStrictEqual(["MissingUpperCaseCharacter"])
  })

})