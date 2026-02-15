/**
 * Convert a number to Indian English words
 * Handles lakhs, crores (Indian numbering system)
 * Example: 113504 → "One Lakh Thirteen Thousand Five Hundred Four Rupees Only"
 */

const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
];

const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
];

function twoDigitWords(n) {
    if (n < 20) return ones[n];
    return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
}

function threeDigitWords(n) {
    if (n === 0) return "";
    if (n < 100) return twoDigitWords(n);
    const h = Math.floor(n / 100);
    const rem = n % 100;
    return ones[h] + " Hundred" + (rem !== 0 ? " " + twoDigitWords(rem) : "");
}

export function numberToWords(num) {
    if (num === undefined || num === null || num === "") return "";

    const n = Math.round(parseFloat(num));
    if (isNaN(n)) return "";
    if (n === 0) return "Zero Rupees Only";

    let result = "";
    let remaining = Math.abs(n);

    // Crores (1,00,00,000+)
    if (remaining >= 10000000) {
        const crores = Math.floor(remaining / 10000000);
        result += threeDigitWords(crores) + " Crore ";
        remaining %= 10000000;
    }

    // Lakhs (1,00,000+)
    if (remaining >= 100000) {
        const lakhs = Math.floor(remaining / 100000);
        result += twoDigitWords(lakhs) + " Lakh ";
        remaining %= 100000;
    }

    // Thousands (1,000+)
    if (remaining >= 1000) {
        const thousands = Math.floor(remaining / 1000);
        result += twoDigitWords(thousands) + " Thousand ";
        remaining %= 1000;
    }

    // Hundreds + remainder
    if (remaining > 0) {
        result += threeDigitWords(remaining);
    }

    result = result.trim();

    if (n < 0) result = "Minus " + result;

    return result + " Rupees Only";
}

export default numberToWords;
