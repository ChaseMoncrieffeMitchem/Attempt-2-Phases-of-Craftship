export function passwordValidator(str: string) {
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    const passwordLength = str.length
    const hasDigit = digits.some(digit => str.includes(digit))
    const isValidLength = passwordLength >= 5 && passwordLength <= 15
    // const hasUppercaseLetter = str !== str.toLowerCase()

    // if (!hasUppercaseLetter) return false
    if (!isValidLength) return false
    if (!hasDigit) return false
    return true

}