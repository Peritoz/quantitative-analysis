export function formatNumber(number: number | undefined | null): string {
    if (number !== undefined && number !== null) {
        return number.toFixed(4).replace(".", ",");
    } else {
        return "?";
    }
}