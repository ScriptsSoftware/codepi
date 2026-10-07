const FORMAT = '[{...}]';

function isCodepack(value) {
    if (typeof value !== 'string') return false;
    if (!value.startsWith('[{') || !value.endsWith('}]')) return false;

    const data = value.slice(2, -2);

    if (!data || !/^[A-Za-z0-9_-]+$/.test(data)) {
        return false;
    }

    return true;
}

function validateCodepack(value) {
    if (!isCodepack(value)) {
        return {
            valid: false,
            safe: false,
            status: 'INVALID'
        };
    }

    return {
        valid: true,
        safe: true,
        status: 'VALID'
    };
}

module.exports = {
    FORMAT,
    isCodepack,
    validateCodepack
};
