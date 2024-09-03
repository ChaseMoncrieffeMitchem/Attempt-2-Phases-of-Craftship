// 🔘 I have implemented the minimum requirements listed in the project description
// 🔘 I have Programmed By Wishful Thinking, designing the response API before it was actually created 
// 🔘 I have Worked Backwards, starting at the Assert, then going to the Act and the Arrange
// 🔘 I have tests that validate the following statements 
// "maxwell1_c" returns a false-y response because of a lack of uppercase characters
// "maxwellTheBe" returns a false-y response because of a lack of digits
// "thePhysical1234567" returns a false-y response because of exceeding the 15 character length
// 🔘 Once I have made the aforementioned tests pass, I have refactored my test specifications to use it.each() to perform parameterization if there is sufficient duplication (see Tip #3 here)
// 🔘 There is no duplication in my test code or my production code
import { passwordValidator } from "./passwordValidator";


describe('password validator', () => {

  it("knows that 'Mommy5' is bw 5 and 15 characters long", () => {
    let resultObject = passwordValidator.validate("Mommy5")

    expect(resultObject.result).toBeTruthy()
    expect(resultObject.errors).toHaveLength(0)
  })

  it("knows that 'Mom5' is NOT bw 5 and 15 characters long", () => {
    let resultObject = passwordValidator.validate("Mom5")

    expect(resultObject.result).toBeFalsy()
    expect(resultObject.errors).toHaveLength(1)
    expect(resultObject.errors[0]).toEqual('InvalidLength')
  })

})