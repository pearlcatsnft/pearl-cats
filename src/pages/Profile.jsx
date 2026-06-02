import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBalance } from '../wallet.js'
import './Profile.css'

const API = 'https://api.pearlcatsnft.com'

export default function Profile({ wallet, onOpenWallet }) {
  const [nfts, setNfts] = useState([])
  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState('0.00')
  const [activeTab, setActiveTab] = useState('nfts')
  const [showPrivkey, setShowPrivkey] = useState(false)
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [sendTo, setSendTo] = useState('')
  const [sendAmount, setSendAmount] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState(null)
  const [sendError, setSendError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (wallet?.address) {
      fetchNFTs()
      getBalance(wallet.address).then(setBalance)
    }
  }, [wallet?.address])

  async function fetchNFTs() {
    setLoading(true)
    try {
      const r = await fetch(`${API}/api/nfts/${wallet.address}`)
      const data = await r.json()
      setNfts(data.nfts || [])
    } catch {}
    setLoading(false)
  }

  async function handleSend() {
    setSending(true)
    setSendResult(null)
    setSendError(null)
    try {
      const r = await fetch(`${API}/api/mint-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privkey: wallet.privkey,
          fromAddress: wallet.address,
          toAddress: sendTo,
          amount: parseFloat(sendAmount)
        })
      })
      const data = await r.json()
      if (data.ok) setSendResult(data.txid)
      else setSendError(data.error)
    } catch(e) { setSendError(e.message) }
    setSending(false)
  }

  function copyAddr() {
    navigator.clipboard.writeText(wallet.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!wallet) {
    return (
      <main className="profile-page">
        <div className="profile-empty">
          <h2>Connect Your Wallet</h2>
          <p>Connect your Pearl wallet to view your profile</p>
          <button className="btn-connect-profile" onClick={onOpenWallet}>Connect Wallet</button>
        </div>
      </main>
    )
  }

  return (
    <main className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <img src="/favicon.png" className="profile-avatar" alt=""/>
          <div className="profile-info">
            <div className="profile-address-row">
              <span className="profile-address">{wallet.address.slice(0,16)}...{wallet.address.slice(-8)}</span>
              <button className="btn-copy-addr" onClick={copyAddr}>{copied ? '✓' : 'Copy'}</button>
            </div>
            <div className="profile-stats">
              <span className="profile-badge">{nfts.length} Pearl Cat{nfts.length !== 1 ? 's' : ''}</span>
              <span className="profile-bal">{parseFloat(balance).toFixed(2)} PRL</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button className={activeTab==='nfts'?'tab active':'tab'} onClick={()=>setActiveTab('nfts')}>My Cats</button>
          <button className={activeTab==='send'?'tab active':'tab'} onClick={()=>setActiveTab('send')}>Send PRL</button>
          <button className={activeTab==='backup'?'tab active':'tab'} onClick={()=>setActiveTab('backup')}>Backup</button>
        </div>

        {/* NFTs Tab */}
        {activeTab === 'nfts' && (
          loading ? <div className="profile-loading">Loading...</div> :
          nfts.length === 0 ? (
            <div className="profile-no-nfts">
              <div className="no-nfts-img"><img src="/mystery-box.jpg" alt="" style={{width:100,opacity:0.5}}/></div>
              <h3>No Pearl Cats yet</h3>
              <p>You don't have any Pearl Cats in this wallet</p>
              <Link to="/mint" className="btn-mint-link">Mint Your First Cat</Link>
            </div>
          ) : (
            <div className="nft-grid">
              {nfts.map((nft, i) => (
                <div key={i} className="nft-card">
                  <div className="nft-img-wrap">
                    <img src="/mystery-box.jpg" alt="Pearl Cat" className="nft-img"/>
                    <div className="nft-unrevealed">Unrevealed</div>
                  </div>
                  <div className="nft-info">
                    <div className="nft-name">Pearl Cat</div>
                    <div className="nft-id">#{nft.tokenId || '???'}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Send Tab */}
        {activeTab === 'send' && (
          <div className="send-section">
            <div className="send-balance">Available: <strong>{parseFloat(balance).toFixed(4)} PRL</strong></div>
            <div className="form-field">
              <label>Recipient Address</label>
              <input type="text" placeholder="prl1p..." value={sendTo} onChange={e=>setSendTo(e.target.value)}/>
            </div>
            <div className="form-field">
              <label>Amount (PRL)</label>
              <input type="number" placeholder="0.00" value={sendAmount} onChange={e=>setSendAmount(e.target.value)} step="0.01"/>
            </div>
            {sendResult && <div className="send-success">Sent! TX: {sendResult.slice(0,16)}...</div>}
            {sendError && <div className="send-error">{sendError}</div>}
            <button
              className={`btn-send ${sendTo && sendAmount ? 'active' : ''}`}
              onClick={handleSend}
              disabled={sending || !sendTo || !sendAmount}
            >
              {sending ? 'Sending...' : 'Send PRL'}
            </button>
          </div>
        )}

        {/* Backup Tab */}
        {activeTab === 'backup' && (
          <div className="backup-section">
            <div className="backup-warning">
              Never share your private key or mnemonic. Anyone with access can steal your funds.
            </div>
            <div className="backup-item">
              <div className="backup-label">Private Key</div>
              <div className="backup-value">
                {showPrivkey ? (
                  <code>{wallet.privkey}</code>
                ) : (
                  <span className="backup-hidden">••••••••••••••••••••••••••••••••</span>
                )}
                <button className="btn-reveal" onClick={()=>setShowPrivkey(!showPrivkey)}>
                  {showPrivkey ? 'Hide' : 'Reveal'}
                </button>
              </div>
            </div>
            {wallet.mnemonic && (
              <div className="backup-item">
                <div className="backup-label">Recovery Phrase</div>
                <div className="backup-value">
                  {showMnemonic ? (
                    <div className="mnemonic-grid">
                      {wallet.mnemonic.split(' ').map((w,i) => (
                        <div key={i} className="mnemonic-word"><span>{i+1}.</span>{w}</div>
                      ))}
                    </div>
                  ) : (
                    <span className="backup-hidden">•••• •••• •••• •••• •••• ••••</span>
                  )}
                  <button className="btn-reveal" onClick={()=>setShowMnemonic(!showMnemonic)}>
                    {showMnemonic ? 'Hide' : 'Reveal'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
