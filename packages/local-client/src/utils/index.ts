/**
 * Remove filename from `pathname` of a URL
 * @param {string} url - The URL
 * @example
 * extractDirectory('https://unpkg.com/my-pkg/index.js').pathname //-> /my-pkg/
 * @return {URL} A new URL with filename stripped off
 */
export function removeFilename(url: string): URL {
    return new URL('./', url);
}

export function randomId() {
    return Math.random().toString(36).substr(2, 5);
}
