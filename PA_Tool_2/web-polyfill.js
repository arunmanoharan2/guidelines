// Web-compatible polyfill for TextEncoder/TextDecoder
if (typeof globalThis !== 'undefined') {
  if (!globalThis.TextEncoder) {
    // For web browsers, these are usually available natively
    // If not, we'll use a basic polyfill
    globalThis.TextEncoder = TextEncoder || function() {
      this.encode = function(str) {
        return new Uint8Array(str.split('').map(c => c.charCodeAt(0)));
      };
    };
    
    globalThis.TextDecoder = TextDecoder || function() {
      this.decode = function(bytes) {
        return String.fromCharCode.apply(null, Array.from(bytes));
      };
    };
  }
}