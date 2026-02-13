/**
 * Format a number using standard metrics (k, M, B)
 * Examples:
 *   5000 => "5k"
 *   50000 => "50k"
 *   1000000 => "1M"
 *   1500000 => "1.5M"
 * 
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string with metric suffix
 */
export const formatNumber = (num: number, decimals: number = 1): string => {
    if (num === 0) return '0';

    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';

    if (absNum >= 1_000_000_000) {
        const value = absNum / 1_000_000_000;
        return sign + (value % 1 === 0 ? value.toFixed(0) : value.toFixed(decimals)) + 'B';
    }

    if (absNum >= 1_000_000) {
        const value = absNum / 1_000_000;
        return sign + (value % 1 === 0 ? value.toFixed(0) : value.toFixed(decimals)) + 'M';
    }

    if (absNum >= 1_000) {
        const value = absNum / 1_000;
        return sign + (value % 1 === 0 ? value.toFixed(0) : value.toFixed(decimals)) + 'k';
    }

    return sign + absNum.toString();
};

/**
 * Format a number as currency with metric suffix
 * Examples:
 *   5000 => "₹5k"
 *   50000 => "₹50k"
 *   1000000 => "₹1M"
 * 
 * @param num - The number to format
 * @param currency - Currency symbol (default: "₹")
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted currency string with metric suffix
 */
export const formatCurrency = (num: number, currency: string = '₹', decimals: number = 1): string => {
    return currency + formatNumber(num, decimals);
};

/**
 * Format a number with commas (for cases where full number is needed)
 * Examples:
 *   5000 => "5,000"
 *   50000 => "50,000"
 * 
 * @param num - The number to format
 * @returns Formatted string with commas
 */
export const formatFullNumber = (num: number): string => {
    return num.toLocaleString('en-IN');
};

/**
 * Format a number input string with commas
 * Examples:
 *   "10000" => "10,000"
 *   "123abcd" => "123"
 * 
 * @param value - The input string
 * @returns Formatted string with commas
 */
export const formatNumberInput = (value: string): string => {
    // Remove all non-numeric characters
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (!cleanValue) return '';

    // Format with commas according to Indian locale
    return parseInt(cleanValue, 10).toLocaleString('en-IN');
};
