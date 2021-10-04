/**
 * Remove filename from `pathname` of a URL
 * @param {string} url - The URL
 * @example
 * extractDirectory('https://unpkg.com/my-pkg/index.js').pathname //-> /my-pkg/
 * @return {URL} A new URL with filename stripped off
 */
function removeFilename(url: string): URL {
    return new URL('./', url);
}

const lets = {
    removeFilename,
};

export default lets;
