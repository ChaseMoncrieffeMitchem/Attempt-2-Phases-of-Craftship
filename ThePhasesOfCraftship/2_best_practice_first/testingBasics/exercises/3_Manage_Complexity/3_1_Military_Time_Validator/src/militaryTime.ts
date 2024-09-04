export class militaryTime {
    public static validate (input: string) {
        const [leftTime, rightTime] = input.split(" - ")

        const leftHour = +leftTime.split(":")[0]
        const rightHour = +rightTime.split(":")[0]
        const validLeftHour = +(leftHour >= 0 && leftHour <= 23)
        const validRightHour = +(rightHour >= 0 && rightHour <= 23)
        
        const leftMinutes = +leftTime.split(":")[1]
        const rightMinutes = +rightTime.split(":")[1]
        const validLeftMinutes = +(leftMinutes >= 0 && leftMinutes <= 59)
        const validRightMinutes = +(rightMinutes >= 0 && rightMinutes <= 59)

        return (validLeftMinutes + validRightMinutes) === 2 && (validLeftHour + validRightHour) === 2
    }
}