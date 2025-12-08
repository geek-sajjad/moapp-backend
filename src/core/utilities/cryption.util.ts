import * as crypto from 'crypto';

export class CryptionUtil {
  private algorithm: string;

  private secretKey: Buffer;

  private ivLength: number;

  constructor(algorithm: string, secretKey: string, ivLength = 16) {
    this.algorithm = algorithm;
    this.secretKey = crypto.createHash('sha256').update(secretKey).digest(); // Ensure 32-byte key
    this.ivLength = ivLength;
  }

  // Hashing Function
  hashData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Encrypt Function
  encryptData(data: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);
    const encrypted = Buffer.concat([
      cipher.update(data, 'utf8'),
      cipher.final(),
    ]);

    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  // Decrypt Function
  decryptData(encryptedData: string): string {
    const [ivHex, encryptedHex] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.secretKey,
      iv,
    );
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  }
}
