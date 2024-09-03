export class passwordValidator {

    public static validate (password: string) {

        let errors = []
        const isValidLength = password.length >= 5 && password.length <= 15
        const digitIsPresent = password.split('').some(char => char >= '0' && char <= '9')
        const hasUppercaseLetter = password.toLowerCase() !== password

        if (!hasUppercaseLetter) {
            errors.push("MissingUpperCaseCharacter")
        }

        if (!digitIsPresent) {
            errors.push("NoDigitIncluded")
        }

        if (!isValidLength) {
            errors.push('InvalidLength')
        }

        return {
            result: errors.length === 0,
            errors
        }
    }







}
