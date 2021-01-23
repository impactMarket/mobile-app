import crypto from 'crypto';

import config from '../../config';

const algorithm = 'aes-256-cbc';
const key = Buffer.from(config.encryptionKey);
const iv = Buffer.from(config.encryptionIV);

export function decrypt(encryptedData: string) {
    const encryptedText = Buffer.from(encryptedData, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
