export class militaryTime {
    public static validate (input: string) {
        const [leftTime, rightTime] = input.split(" - ")
        const leftHour = +leftTime[0].split(":")[0]
        const rightHour = +rightTime[1].split(":")[0]

        
        const isValidMinutes = (time: string) => {
            const minutes = +time.split(":")[1]
            return minutes >= 0 && minutes <= 59
        }

        const isValidHours = (time: string) => {
            const hours = +time.split(":")[0]
            return hours >= 0 && hours <= 23
        }
        // const leftMinutes = +leftTime[0].split(":")[1]
        // const rightMinutes = +rightTime[1].split(":")[1]
        // console.log(rightMinutes)

        // if (leftMinutes <= 59 && rightMinutes <= 59) {
        //     return true
        // }

        // if (leftHour < 24 && rightHour < 24) {
        //     return true
        // }

        return isValidMinutes(leftTime) && isValidMinutes(rightTime) && isValidHours(leftTime) && isValidHours(rightTime)


    }
}