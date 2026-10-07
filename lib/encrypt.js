const crypto = require('crypto');

const PI = '3.14159265358979323846264338327950288419716939937510';
const FORMAT = `π+[${PI}]{}\/`;

function deriveKey(password) {
    return crypto
        .createHash('sha256')
        .update(FORMAT + password, 'utf8')
        .digest();
}

function encrypt(message, password) {
    if (typeof message !== 'string') {
        throw new TypeError('Message must be a string');
    }

    if (typeof password !== 'string' || password.length === 0) {
        throw new Error('Password is required');
    }

    const key = deriveKey(password);

    // Random 96-bit nonce
    const nonce = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(
        'aes-256-gcm',
        key,
        nonce
    );

    cipher.setAAD(Buffer.from(FORMAT, 'utf8'));

    const encrypted = Buffer.concat([
        cipher.update(message, 'utf8'),
        cipher.final()
    ]);

    const authTag = cipher.getAuthTag();

    // nonce + authentication tag + encrypted data
    const packet = Buffer.concat([
        nonce,
        authTag,
        encrypted
    ]);

    return `[{${packet.toString('base64url')}}]`;
}

module.exports = {
    encrypt
};
