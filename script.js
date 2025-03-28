// Utility Generator Class
class UtilityGenerator {
    static generateUUID() {
        return crypto.randomUUID();
    }

    static generatePassword(length, options) {
        const charsets = {
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
        };

        const similarChars = 'oOiIlL10';
        const ambiguousChars = '{}[]()/\'"`~,;:.<>';

        if (length < 8 || length > 256) {
            throw new Error('Password length must be between 8 and 256 characters');
        }

        let chars = Object.entries(options)
            .filter(([key, value]) => value && charsets[key])
            .map(([key]) => charsets[key])
            .join('');

        if (!chars) {
            chars = Object.values(charsets).join('');
        }

        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array, byte => chars[byte % chars.length]).join('');
    }

    static async getQRCodeURL(text, size = 350) {
        return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
    }
}

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

themeToggle.addEventListener('click', () => {
    // Toggle between light and dark themes
    if (htmlElement.classList.contains('light-theme')) {
        htmlElement.classList.remove('light-theme');
        htmlElement.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        htmlElement.classList.remove('dark-theme');
        htmlElement.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
    }
});

// Restore theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        htmlElement.classList.remove('light-theme');
        htmlElement.classList.add('dark-theme');
    }
});

// UUID Generator
const uuidGenerateBtn = document.getElementById('generate-uuid');
const uuidResult = document.getElementById('uuid-result');
const copyUuidBtn = document.getElementById('copy-uuid');

uuidGenerateBtn.addEventListener('click', () => {
    const uuid = UtilityGenerator.generateUUID();
    uuidResult.textContent = uuid;
    copyUuidBtn.style.display = 'block';
});

copyUuidBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(uuidResult.textContent)
        .then(() => alert('UUID copied to clipboard!'));
});

// Password Generator
const passwordLengthSelect = document.getElementById('password-length');
const generatePasswordBtn = document.getElementById('generate-password');
const passwordResult = document.getElementById('password-result');
const copyPasswordBtn = document.getElementById('copy-password');

generatePasswordBtn.addEventListener('click', () => {
    const length = parseInt(passwordLengthSelect.value);
    const options = {
        lowercase: document.getElementById('include-lowercase').checked,
        uppercase: document.getElementById('include-uppercase').checked,
        numbers: document.getElementById('include-numbers').checked,
        symbols: document.getElementById('include-symbols').checked
    };

    const password = UtilityGenerator.generatePassword(length, options);
    passwordResult.textContent = password;
    copyPasswordBtn.style.display = 'block';
});

copyPasswordBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(passwordResult.textContent)
        .then(() => alert('Password copied to clipboard!'));
});

// QR Code Generator
const qrCodeTextInput = document.getElementById('qr-code-text');
const generateQRCodeBtn = document.getElementById('generate-qr-code');
const qrCodeContainer = document.getElementById('qr-code-container');

generateQRCodeBtn.addEventListener('click', async () => {
    const text = qrCodeTextInput.value || 'Hello, World!';
    const qrCodeURL = await UtilityGenerator.getQRCodeURL(text);
    
    qrCodeContainer.innerHTML = `<img src="${qrCodeURL}" alt="QR Code">`;
});