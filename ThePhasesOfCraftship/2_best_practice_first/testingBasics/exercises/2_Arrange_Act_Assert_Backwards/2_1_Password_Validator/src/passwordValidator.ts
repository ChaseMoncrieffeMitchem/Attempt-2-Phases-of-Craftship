export class passwordValidator {

    public static validate (password: string) {

        let errors = []
        const isValidLength = password.length >= 5 && password.length <= 15

        if (!isValidLength) {
            errors.push('InvalidLength')
        }

        return {
            result: errors.length === 0,
            errors
        }
    }






    
}
