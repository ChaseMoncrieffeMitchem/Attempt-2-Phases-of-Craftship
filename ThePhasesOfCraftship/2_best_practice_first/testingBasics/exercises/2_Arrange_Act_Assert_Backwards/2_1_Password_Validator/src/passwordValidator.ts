export function passwordValidator(str: string) {
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    const passwordLength = str.length
    const hasDigit = digits.some(digit => str.includes(digit))
    const isValidLength = passwordLength >= 5 && passwordLength <= 15

    if (!isValidLength) return false
    if (!hasDigit) return false
    return true

    // if (str === "mom555") return true
    // if (str === "mom") return false
    // if (str === "mommy") return false
}