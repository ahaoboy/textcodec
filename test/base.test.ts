import { expect, test } from "vitest";
import {
  TextDecoder as Decoder,
  TextEncoder as Encoder,
  TextDecoder,
} from "../src";

const encodeData = [
  "hello",
  "hello 你好",
  "🌏",
  "hello 🌍🌎🌏",
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.!~*'()",
  "☃★♲",
  "Hello, 世界! 🌍'",
  "%",
  "%%%",
  "%25",
  "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
  "\uD800\uDFFF",
];

// [ 239, 191, 189 ]
const encodeError = [String.fromCharCode(0xD800)];

const decodeData = [
  [37],
  [115, 116, 195, 165, 108, 101],
  [194, 181],
  [240, 159, 140, 143],
];

const decodeError = [[0xc0], [0xe0, 0x80], [0xf0, 0x80, 0x80]];

const encoder = new Encoder();
const decoder = new Decoder();
const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

test("encode", () => {
  for (const i of encodeData) {
    expect(textEncoder.encode(i)).toEqual(encoder.encode(i));
  }

  // for(const s of encodeError){
  //   expect(encoder.encode(s)).toEqual(textEncoder.encode(s))
  // }
});

test("decode and encode", () => {
  for (const i of encodeData) {
    expect(decoder.decode(textEncoder.encode(i))).toEqual(i);
  }

  for (const i of decodeData) {
    expect(textEncoder.encode(decoder.decode(new Uint8Array(i)))).toEqual(
      new Uint8Array(i)
    );
  }
});

test("decode", () => {
  for (const i of decodeData) {
    expect(decoder.decode(new Uint8Array(i))).toEqual(
      textDecoder.decode(new Uint8Array(i))
    );
  }

  for (const i of decodeError) {
    expect(() => decoder.decode(new Uint8Array(i))).toThrow();
    expect(() => textDecoder.decode(new Uint8Array(i))).toThrow();
  }
});
