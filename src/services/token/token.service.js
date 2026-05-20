import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { jwt_expires_in, jwt_secret } from '../../config/index.js'

class TokenService {
    async generateAuthTokens(userId) {
        const accessToken = jwt.sign({ sub: userId }, jwt_secret, { expiresIn: jwt_expires_in || '10m' })

        return accessToken
    }

    // ─── Passwords (slow hash via bcrypt) ───────────────────────────────────
    // Never use a fast hash (SHA256, MD5) for passwords — they are trivially
    // brute-forced. bcrypt with cost 12 takes ~250ms per attempt.

    async hashPassword(password) {
        const salt = await bcrypt.genSalt(12)
        return bcrypt.hash(password, salt)
    }

    async comparePassword(plain, hashed) {
        return bcrypt.compare(plain, hashed)
    }

    // ─── OTP / Tokens (fast hash via SHA256 is fine here) ───────────────────
    // We store the *hash* of OTPs/reset-tokens in the DB so a leak doesn't
    // expose the raw value. SHA256 is appropriate for this use case.

    generateOTPTokens(size = 6) {
        const bytes = crypto.randomBytes(Math.ceil(size / 2)).toString('hex')
        return bytes.slice(0, size)
    }
    /**
     * Hash an OTP or token for safe storage (SHA256, hex output)
     */
    hashToken(value) {
        return crypto.createHash('sha256').update(String(value)).digest('hex')
    }

}

const tokenService = new TokenService()

export default tokenService