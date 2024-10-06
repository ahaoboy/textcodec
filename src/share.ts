export function throwError(): never {
  const E = typeof URIError !== "function" ? Error : URIError
  throw new E("Invalid UTF-8 sequence")
}

export function utf8Decode(bytes: number[]): string {
  const list: string[] = []
  for (let i = 0; i < bytes.length; ) {
    if (bytes[i] < 128) {
      list.push(String.fromCharCode(bytes[i]))
      i++
    } else if (bytes[i] > 191 && bytes[i] < 224) {
      list.push(
        String.fromCharCode(((bytes[i] & 31) << 6) | (bytes[i + 1] & 63)),
      )
      i += 2
    } else if (bytes[i] > 223 && bytes[i] < 240) {
      list.push(
        String.fromCharCode(
          ((bytes[i] & 15) << 12) |
            ((bytes[i + 1] & 63) << 6) |
            (bytes[i + 2] & 63),
        ),
      )
      i += 3
    } else {
      const codePoint =
        ((bytes[i] & 7) << 18) |
        ((bytes[i + 1] & 63) << 12) |
        ((bytes[i + 2] & 63) << 6) |
        (bytes[i + 3] & 63)
      list.push(String.fromCodePoint(codePoint))
      i += 4
    }
  }
  return list.join("")
}