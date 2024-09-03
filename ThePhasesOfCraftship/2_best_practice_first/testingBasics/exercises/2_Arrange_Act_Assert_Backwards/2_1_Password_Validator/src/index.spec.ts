import { passwordValidator } from "./passwordValidator"

// 🔘 I have implemented the minimum requirements listed in the project description
// 🔘 I have Programmed By Wishful Thinking, designing the response API before it was actually created 
// 🔘 I have Worked Backwards, starting at the Assert, then going to the Act and the Arrange
// 🔘 I have tests that validate the following statements 
// "maxwell1_c" returns a false-y response because of a lack of uppercase characters
// "maxwellTheBe" returns a false-y response because of a lack of digits
// "thePhysical1234567" returns a false-y response because of exceeding the 15 character length
// 🔘 Once I have made the aforementioned tests pass, I have refactored my test specifications to use it.each() to perform parameterization if there is sufficient duplication (see Tip #3 here)
// 🔘 There is no duplication in my test code or my production code

describe('password validator', () => {

  it('returns true when "mom555" bw 5 and 15 chars long', () => {
    expect(passwordValidator("mom555")).toBe(true)
  })
})


