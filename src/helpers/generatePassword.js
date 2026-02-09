import crypto from "crypto"

export const generatePassword = (length = 12) => {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "abcdefghijklmnopqrstuvwxyz" +
        "0123456789" +
        "!@#$%^&*_-+="

    const randomBytes = crypto.randomBytes(length)
    let password = ""

    for (let i = 0; i < length; i++) {
        password += chars[randomBytes[i] % chars.length]
    }

    return password
}

export default generatePassword