import pyperclip

# Get the text from the clipboard
text = pyperclip.paste()

# Print each character and its ASCII value
for char in text:
    print(f"'{char}': {ord(char)}")
