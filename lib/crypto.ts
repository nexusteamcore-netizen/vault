import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY_HEX = process.env.ENCRYPTION_KEY!

function getKey(): Buffer {
  if (!KEY_HEX) throw new Error('ENCRYPTION_KEY is not set')
  // Clean the hex string from quotes and whitespace
  const cleanHex = KEY_HEX.trim().replace(/^["']|["']$/g, '')
  return Buffer.from(cleanHex, 'hex')
}

export function encrypt(plaintext: string): { encryptedValue: string; iv: string; tag: string } {
  const iv = crypto.randomBytes(12)
  const key = getKey()
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return {
    encryptedValue: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
  }
}

export function decrypt(encryptedValue: string, iv: string, tag: string): string {
  const key = getKey()
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(iv, 'base64'))
  decipher.setAuthTag(Buffer.from(tag, 'base64'))
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, 'base64')),
    decipher.final(),
  ])
  return decrypted.toString('utf8')
}
