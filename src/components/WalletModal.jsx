import React, { useState } from 'react'
import { createWallet, deriveWallet, importFromPrivkey, isValidAddress } from '../wallet'
import './WalletModal.css'

export default function WalletModal({ wallet, onSave, onClose }) {
  const [tab, setTab] = useState(wallet ? 'info' : 'create')
  const [mnemonic, setMnemonic] = useState('')
  const [privkey, setPrivkey] = useState('')
  const [newWallet, setNewWallet] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
  const [showPriv, setShowPriv] = useState(false)

  function handleCreate() {
    const w = createWallet()
    setNewWallet(w)
    setTab('confirm')
  }

  function handleImportMnemonic() {
    try {
      const w = deriveWallet(mnemonic.trim())
      onSave(w)
      onClose()
    } catch(e) { setError('Invalid mnemonic phrase') }
  }

  function handleImportPrivkey() {
    try {
      const w = importFromPrivkey(privkey.trim())
      onSave(w)
      onClose()
    } catch(e) { setError('Invalid private key') }
  }

  function handleConfirm() {
    onSave(newWallet)
    onClose()
  }

  function copy(text, key) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  function handleExport() {
    const data = JSON.stringify(wallet, null, 2)
    const blob = new Blob([data], {type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'pearl-wallet.json'; a.click()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span>🐱 Pearl Wallet</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-tabs">
          {wallet ? (
            <>
              <button className={tab==='info'?'active':''} onClick={() => setTab('info')}>My Wallet</button>
              <button className={tab==='import'?'active':''} onClick={() => setTab('import')}>Import</button>
            </>
          ) : (
            <>
              <button className={tab==='create'?'active':''} onClick={() => setTab('create')}>Create</button>
              <button className={tab==='import'?'active':''} onClick={() => setTab('import')}>Import</button>
            </>
          )}
        </div>

        <div className="modal-body">
          {tab === 'info' && wallet && (
            <div className="wallet-info">
              <div className="info-row">
                <label>Address</label>
                <div className="info-value">
                  <code>{wallet.address}</code>
                  <button onClick={() => copy(wallet.address, 'addr')}>{copied==='addr'?'✓':'Copy'}</button>
                </div>
              </div>
              {wallet.mnemonic && (
                <div className="info-row">
                  <label>Recovery Phrase</label>
                  <div className="mnemonic-grid">
                    {wallet.mnemonic.split(' ').map((w, i) => (
                      <div key={i} className="mnemonic-word"><span className="word-num">{i+1}</span>{w}</div>
                    ))}
                  </div>
                  <button className="btn-copy-mn" onClick={() => copy(wallet.mnemonic, 'mn')}>{copied==='mn'?'✓ Copied':'Copy Mnemonic'}</button>
                </div>
              )}
              <div className="info-row">
                <label>Private Key</label>
                <div className="info-value">
                  <code>{showPriv ? wallet.privkey : '••••••••••••••••••••••••••••••••'}</code>
                  <button onClick={() => setShowPriv(!showPriv)}>{showPriv?'Hide':'Show'}</button>
                  {showPriv && <button onClick={() => copy(wallet.privkey, 'priv')}>{copied==='priv'?'✓':'Copy'}</button>}
                </div>
                <p className="warning">⚠️ Never share your private key with anyone</p>
              </div>
              <button className="btn-export" onClick={handleExport}>⬇ Export Wallet</button>
            </div>
          )}

          {tab === 'create' && (
            <div className="create-wallet">
              <p className="create-desc">Generate a new Pearl wallet with a 12-word recovery phrase.</p>
              <button className="btn-create" onClick={handleCreate}>Generate New Wallet</button>
            </div>
          )}

          {tab === 'confirm' && newWallet && (
            <div className="confirm-wallet">
              <p className="confirm-warning">⚠️ Write down your recovery phrase. If you lose it, you lose access to your wallet forever.</p>
              <div className="mnemonic-grid">
                {newWallet.mnemonic.split(' ').map((w, i) => (
                  <div key={i} className="mnemonic-word"><span className="word-num">{i+1}</span>{w}</div>
                ))}
              </div>
              <button className="btn-copy-mn" onClick={() => copy(newWallet.mnemonic, 'newmn')}>{copied==='newmn'?'✓ Copied':'Copy Recovery Phrase'}</button>
              <div className="new-address">
                <label>Your Address</label>
                <code>{newWallet.address}</code>
              </div>
              <button className="btn-confirm" onClick={handleConfirm}>I've saved my phrase — Continue</button>
            </div>
          )}

          {tab === 'import' && (
            <div className="import-wallet">
              <div className="import-option">
                <label>Import with Recovery Phrase (12 words)</label>
                <textarea
                  placeholder="word1 word2 word3 ... word12"
                  value={mnemonic}
                  onChange={e => { setMnemonic(e.target.value); setError('') }}
                  rows={3}
                />
                <button className="btn-import" onClick={handleImportMnemonic}>Import Wallet</button>
              </div>
              <div className="import-divider">or</div>
              <div className="import-option">
                <label>Import with Private Key (hex)</label>
                <input
                  type="password"
                  placeholder="64-character hex private key"
                  value={privkey}
                  onChange={e => { setPrivkey(e.target.value); setError('') }}
                />
                <button className="btn-import" onClick={handleImportPrivkey}>Import from Key</button>
              </div>
              {error && <p className="error-msg">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
