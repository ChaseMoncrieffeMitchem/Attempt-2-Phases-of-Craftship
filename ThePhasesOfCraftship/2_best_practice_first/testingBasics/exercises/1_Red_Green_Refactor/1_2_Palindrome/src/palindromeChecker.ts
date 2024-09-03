

export function palindromeChecker(str: string) {
    const reversedStr = str.split("").reverse().join("")
    return str.toLowerCase() === reversedStr.toLowerCase()
}