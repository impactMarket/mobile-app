import crypto from 'crypto';
import config from '../../config';

const algorithm = 'aes-256-cbc';
const key = Buffer.from(config.encryptionKey);
const iv = Buffer.from(config.encryptionIV);

export function encrypt(text: string) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

export function decrypt(encryptedData: string) {
    let encryptedText = Buffer.from(encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
