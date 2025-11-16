export class Cryptography {
  private static readonly ALGORITHM = 'AES-GCM'
  private static readonly KEY_LENGTH = 256
  private static readonly IV_LENGTH = 12
  private static readonly SALT_LENGTH = 16
  private static readonly ITERATIONS = 100000

  private static async generateKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    )

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: this.ITERATIONS,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: this.ALGORITHM, length: this.KEY_LENGTH },
      false,
      ['encrypt', 'decrypt']
    )
  }

  static async encrypt(data: string, password: string): Promise<string> {
    try {
      const salt = crypto.getRandomValues(new Uint8Array(this.SALT_LENGTH))
      const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH))
      const key = await this.generateKey(password, salt)
      const encoder = new TextEncoder()

      const encryptedContent = await crypto.subtle.encrypt(
        {
          name: this.ALGORITHM,
          iv
        },
        key,
        encoder.encode(data)
      )

      const encryptedArray = new Uint8Array(encryptedContent)
      const resultArray = new Uint8Array(salt.length + iv.length + encryptedArray.length)
      resultArray.set(salt, 0)
      resultArray.set(iv, salt.length)
      resultArray.set(encryptedArray, salt.length + iv.length)

      return btoa(String.fromCharCode(...resultArray))
    } catch (error) {
      console.error('Encryption failed:', error)
      throw new Error('Encryption failed')
    }
  }

  static async decrypt(encryptedData: string, password: string): Promise<string> {
    try {
      const encryptedArray = new Uint8Array(
        atob(encryptedData)
          .split('')
          .map(char => char.charCodeAt(0))
      )

      const salt = encryptedArray.slice(0, this.SALT_LENGTH)
      const iv = encryptedArray.slice(this.SALT_LENGTH, this.SALT_LENGTH + this.IV_LENGTH)
      const data = encryptedArray.slice(this.SALT_LENGTH + this.IV_LENGTH)

      const key = await this.generateKey(password, salt)

      const decryptedContent = await crypto.subtle.decrypt(
        {
          name: this.ALGORITHM,
          iv
        },
        key,
        data
      )

      const decoder = new TextDecoder()
      return decoder.decode(decryptedContent)
    } catch (error) {
      console.error('Decryption failed:', error)
      throw new Error('Decryption failed')
    }
  }
}
