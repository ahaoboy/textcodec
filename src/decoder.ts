import { throwError, utf8Decode } from "./share";

function decode(bytes: Uint8Array): string {
  const result: string[] = [];
  const len = bytes.length;
  let i = 0;
  while (i < len) {
    const v1 = bytes[i];
    if (v1 < 128) {
      result.push(String.fromCharCode(v1));
      i++;
    } else {
      if (v1 >> 5 === 6) {
        if (i + 2 > len) {
          throwError();
        }
        const v2 = bytes[i + 1];
        if (v2 >> 6 !== 2) {
          throwError();
        }
        result.push(utf8Decode([v1, v2]));
        i += 2;
      } else if (v1 >> 4 === 14) {
        if (i + 3 > len) {
          throwError();
        }
        const v2 = bytes[i + 1];
        if (v2 >> 6 !== 2) {
          throwError();
        }
        const v3 = bytes[i + 2];
        if (v3 >> 6 !== 2) {
          throwError();
        }
        result.push(utf8Decode([v1, v2, v3]));
        i += 3;
      } else if (v1 >> 3 === 30) {
        if (i + 4 > len) {
          throwError();
        }
        const v2 = bytes[i + 1];
        if (v2 >> 6 !== 2) {
          throwError();
        }
        const v3 = bytes[i + 2];
        if (v3 >> 6 !== 2) {
          throwError();
        }
        const v4 = bytes[i + 3];
        if (v4 >> 6 !== 2) {
          throwError();
        }
        result.push(utf8Decode([v1, v2, v3, v4]));
        i += 4;
      } else {
        throwError();
      }
    }
  }
  return result.join("");
}

export class TextDecoder {
  decode(input: Uint8Array): string {
    return decode(input);
  }
}
