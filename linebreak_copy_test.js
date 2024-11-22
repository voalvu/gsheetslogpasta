import clipboardy from 'clipboardy';

// Prepare your text with the appropriate line breaks
const text = `"Line 1\r\nLine 2\r\nLine 3"`;

// Copy the text to the clipboard
clipboardy.writeSync(text);

console.log('Text copied to clipboard with line breaks!');