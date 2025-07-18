// TextEncoder polyfill for environments where it's not available
if (typeof globalThis !== 'undefined') {
  if (!globalThis.TextEncoder) {
    const { TextEncoder, TextDecoder } = require('util');
    globalThis.TextEncoder = TextEncoder;
    globalThis.TextDecoder = TextDecoder;
  }
} else if (typeof global !== 'undefined') {
  if (!global.TextEncoder) {
    const { TextEncoder, TextDecoder } = require('util');
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
  }
}