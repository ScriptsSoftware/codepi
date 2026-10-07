const crypto = require('crypto');

const PI = '3.14159265358979323846264338327950288419716939937510';
const FORMAT = `π+[${PI}]{}\/`;

function deriveKey(password) {
    return crypto
        .createHash('sha256')
        .update(FORMAT + password, 'utf8')
        .digest();
}

function decrypt(packet, password) {
    if (typeof packet !== 'string') {
        throw new TypeError('Codepack must be a string');
    }

    if (!packet.startsWith('[{') || !packet.endsWith('}]')) {
        throw new Error('Invalid Codepack format');
    }

    if (typeof password !== 'string' || password.length === 0) {
        throw new Error('Password is required');
    }

    const encoded = packet.slice(2, -2);

    let data;
    try {
        data = Buffer.from(encoded, 'base64url');
    } catch {
        throw new Error('Invalid Codepack data');
    }

    // 12-byte nonce + 16-byte authentication tag + ciphertext
    if (data.length < 28) {
        throw new Error('Invalid Codepack data');
    }

    const nonce = data.subarray(0, 12);
    const authTag = data.subarray(12, 28);
    const encrypted = data.subarray(28);

    const key = deriveKey(password);

    try {
        const decipher = crypto.createDecipheriv(
            'aes-256-gcm',
            key,
            nonce
        );

        decipher.setAAD(Buffer.from(FORMAT, 'utf8'));
        decipher.setAuthTag(authTag);

        return Buffer.concat([
            decipher.update(encrypted),
            decipher.final()
        ]).toString('utf8');
    } catch {
        throw new Error('Authentication failed');
    }
}

module.exports = {
    decrypt
};
