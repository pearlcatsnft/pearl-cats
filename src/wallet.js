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

// ===== TX SENDING =====

const PEARL_NODE = 'https://api.pearlscriptions.com'
const API_URL = 'https://api.pearlcatsnft.com'

export async function getUTXOs(address) {
  const r = await fetch(`${PEARL_NODE}/api/addresses/${address}/utxos?limit=100`)
  const data = await r.json()
  return data.utxos || []
}

export async function broadcastTx(txhex) {
  const r = await fetch(`${API_URL}/api/broadcast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawTx: txhex })
  })
  return await r.json()
}

export async function sendPRL(privkeyHex, fromAddress, toAddress, amountPRL) {
  const privBytes = fromHex(privkeyHex)
  const amountSats = BigInt(Math.round(amountPRL * 1e8))
  const feeSats = 10000n // 0.0001 PRL fee

  // Get UTXOs
  const utxos = await getUTXOs(fromAddress)
  if (!utxos.length) throw new Error('No UTXOs available')

  // Select UTXOs
  let selected = []
  let total = 0n
  for (const u of utxos) {
    selected.push(u)
    total += BigInt(Math.round(parseFloat(u.valuePrl) * 1e8))
    if (total >= amountSats + feeSats) break
  }
  if (total < amountSats + feeSats) throw new Error('Insufficient balance')

  const change = total - amountSats - feeSats

  // Build TX
  const version = Buffer.from([0x01, 0x00, 0x00, 0x00])
  const locktime = Buffer.from([0x00, 0x00, 0x00, 0x00])
  const sequence = Buffer.from([0xff, 0xff, 0xff, 0xff])

  // Inputs
  const inputs = selected.map(u => {
    const txidLE = Buffer.from(u.txid, 'hex').reverse()
    const vout = Buffer.allocUnsafe(4)
    vout.writeUInt32LE(u.vout, 0)
    return { txidLE, vout, txid: u.txid, voutIdx: u.vout, value: BigInt(Math.round(parseFloat(u.valuePrl) * 1e8)) }
  })

  // Outputs
  const toSpk = addrToSpk(toAddress)
  const fromSpk = addrToSpk(fromAddress)

  function writeAmount(sats) {
    const b = Buffer.allocUnsafe(8)
    b.writeBigInt64LE(sats, 0)
    return b
  }

  const outputs = [
    Buffer.concat([writeAmount(amountSats), Buffer.from([toSpk.length]), toSpk]),
  ]
  if (change > 546n) {
    outputs.push(Buffer.concat([writeAmount(change), Buffer.from([fromSpk.length]), fromSpk]))
  }

  const outputsConcat = Buffer.concat(outputs)

  // Sighash for each input (taproot keypath)
  const { sha256 } = await import('@noble/hashes/sha2.js')

  function taggedHash(tag, data) {
    const tagBytes = new TextEncoder().encode(tag)
    const h = sha256(tagBytes)
    return sha256(new Uint8Array([...h, ...h, ...(data instanceof Uint8Array ? data : new Uint8Array(data))]))
  }

  // Build witnesses
  const witnesses = []

  for (let i = 0; i < inputs.length; i++) {
    const inp = inputs[i]

    const allOutpoints = Buffer.concat(inputs.map(x => Buffer.concat([x.txidLE, x.vout])))
    const allAmounts = Buffer.concat(inputs.map(x => writeAmount(x.value)))
    const allScripts = Buffer.concat(inputs.map(() => {
      const spk = fromSpk
      return Buffer.concat([compactSize(spk.length), spk])
    }))
    const allSeqs = Buffer.concat(inputs.map(() => sequence))
    const outConcat = outputsConcat

    const shaOutpoints = taggedHash('', allOutpoints) // we'll use sha256 direct
    const shaPrevouts = sha256(allOutpoints)
    const shaAmounts = sha256(allAmounts)
    const shaScriptPubkeys = sha256(allScripts)
    const shaSequences = sha256(allSeqs)
    const shaOutputs = sha256(outConcat)

    const outpoint = Buffer.concat([inp.txidLE, inp.vout])
    const spk = fromSpk

    const sigmsg = Buffer.concat([
      Buffer.from([0x00, 0x00]),
      version,
      locktime,
      shaPrevouts,
      shaAmounts,
      shaScriptPubkeys,
      shaSequences,
      shaOutputs,
      Buffer.from([0x02]),
      Buffer.from(new Uint8Array(4)), // input index
      Buffer.from([0x00]),
      Buffer.allocUnsafe(4).fill(0xff),
    ])

    // Use secp schnorr sign
    const sighash = taggedHash('TapSighash', sigmsg)
    const sig = await secp.schnorr.sign(sighash, privBytes)

    witnesses.push(sig)
  }

  // Serialize TX
  const inputCount = compactSize(inputs.length)
  const outputCount = compactSize(outputs.length)

  const serializedInputs = Buffer.concat(inputs.map(inp =>
    Buffer.concat([inp.txidLE, inp.vout, Buffer.from([0x00]), sequence])
  ))

  const witnessData = Buffer.concat(witnesses.map(w =>
    Buffer.concat([Buffer.from([0x01]), compactSize(w.length), Buffer.from(w)])
  ))

  const rawTx = Buffer.concat([
    version,
    Buffer.from([0x00, 0x01]), // segwit marker
    inputCount,
    serializedInputs,
    outputCount,
    outputsConcat,
    witnessData,
    locktime,
  ])

  return broadcastTx(rawTx.toString('hex'))
}
