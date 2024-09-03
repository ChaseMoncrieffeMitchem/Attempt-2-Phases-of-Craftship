

export function palindromeChecker(str: string) {
    const noramlizedStr = str.split(' ').join('').toLowerCase()
    const reversedStr = noramlizedStr.split('').reverse().join("")
    return noramlizedStr === reversedStr
 }