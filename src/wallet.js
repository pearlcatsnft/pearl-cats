import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'
import { HDKey } from '@scure/bip32'
import * as secp from '@noble/secp256k1'
import { sha256 } from '@noble/hashes/sha2.js'

const HRP = 'prl'
const CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'
const N = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141n

function taggedHash(tag, data) {
  const enc = new TextEncoder()
  const tagBytes = enc.encode(tag)
  const h = sha256(tagBytes)
  const input = new Uint8Array([...h, ...h, ...(data instanceof Uint8Array ? data : new Uint8Array(data))])
  return sha256(input)
}

function polymod(values) {
  const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3]
  let chk = 1
  for (const v of values) {
    const b = chk >> 25
    chk = ((chk & 0x1ffffff) << 5) ^ v
    for (let i = 0; i < 5; i++) chk ^= (b >> i) & 1 ? GEN[i] : 0
  }
  return chk
}

function encodeBech32m(xonly) {
  const data = [1]
  let acc = 0, bits = 0
  for (const byte of xonly) {
    acc = ((acc << 8) | byte) & 0x1fff
    bits += 8
    while (bits >= 5) { bits -= 5; data.push((acc >> bits) & 0x1f) }
  }
  if (bits > 0) data.push((acc << (5 - bits)) & 0x1f)
  const hrpExp = [...HRP].map(c => c.charCodeAt(0) >> 5).concat([0], [...HRP].map(c => c.charCodeAt(0) & 31))
  const poly = polymod([...hrpExp, ...data, 0, 0, 0, 0, 0, 0]) ^ 0x2bc830a3
  const checksum = Array.from({ length: 6 }, (_, i) => (poly >> (5 * (5 - i))) & 31)
  return HRP + '1' + [...data, ...checksum].map(d => CHARSET[d]).join('')
}

function decodeBech32m(addr) {
  addr = addr.toLowerCase()
  const pos = addr.lastIndexOf('1')
  const decoded = [...addr.slice(pos + 1)].map(c => CHARSET.indexOf(c))
  const values = decoded.slice(0, -6)
  let acc = 0, bits = 0
  const result = []
  for (const v of values.slice(1)) {
    acc = ((acc << 5) | v); bits += 5
    while (bits >= 8) { bits -= 8; result.push((acc >> bits) & 0xff) }
  }
  return new Uint8Array(result)
}

export function addrToSpk(addr) {
  return new Uint8Array([0x51, 0x20, ...decodeBech32m(addr)])
}

function toHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

function fromHex(hex) {
  return new Uint8Array(hex.match(/.{1,2}/g).map(b => parseInt(b, 16)))
}

function taprootAddress(privkey) {
  // Internal xonly pubkey
  const xonly = secp.schnorr.getPublicKey(privkey)
  
  // TapTweak(xonly || empty_merkle_root)
  const tweak = taggedHash('TapTweak', xonly)
  
  // tweakedPriv = (privkey + tweak) % N
  const privBig = BigInt('0x' + toHex(privkey))
  const tweakBig = BigInt('0x' + toHex(tweak))
  const tweakedPriv = fromHex(((privBig + tweakBig) % N).toString(16).padStart(64, '0'))
  
  // tweaked pubkey
  const tweakedPub = secp.schnorr.getPublicKey(tweakedPriv)
  
  return {
    xonly: tweakedPub,
    address: encodeBech32m(tweakedPub),
    internalXonly: xonly,
    tweakedPriv
  }
}

function privkeyToAddress(privBytes) {
  const { xonly, address } = taprootAddress(privBytes)
  return { xonly, address }
}

export function createWallet() {
  const mnemonic = generateMnemonic(wordlist, 128)
  return deriveWallet(mnemonic)
}

export function deriveWallet(mnemonic, index = 0) {
  if (!validateMnemonic(mnemonic, wordlist)) throw new Error('Invalid mnemonic')
  const seed = mnemonicToSeedSync(mnemonic)
  const hdkey = HDKey.fromMasterSeed(seed)
  const child = hdkey.derive(`m/86'/808276'/0'/0/${index}`)
  const privBytes = child.privateKey
  const { xonly, address } = privkeyToAddress(privBytes)
  return {
    mnemonic,
    privkey: toHex(privBytes),
    xonly: toHex(xonly),
    address,
    path: `m/86'/808276'/0'/0/${index}`
  }
}

export function importFromPrivkey(privhex) {
  const privBytes = fromHex(privhex.trim())
  const { xonly, address } = privkeyToAddress(privBytes)
  return { privkey: privhex.trim(), xonly: toHex(xonly), address }
}

export function isValidAddress(addr) {
  try {
    if (!addr.startsWith('prl1')) return false
    decodeBech32m(addr)
    return true
  } catch { return false }
}
