import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import './MintSection.css'

const TREASURY = 'prl1ppprdt49dyv2am07fyuykfs3f6r3cgfcsa5fwc2sqnszuhlrcqyqs9v5j8u'
const MINT_PRICE = 0.77
const API = 'https://api.pearlcatsnft.com'

export default function MintSection({ wallet, stats, onOpenWallet }) {
  const [amount, setAmount] = useState(1)
  const [sending, setSending] = useState(false)
  const [txid, setTxid] = useState(null)
  const [error, setError] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  
  const totalCost = (amount * MINT_PRICE).toFixed(2)

const progress = (stats.minted / stats.total) * 100

  function handleMint() {
    setShowConfirm(true)
  }

  async function confirmMint() {
    setShowConfirm(false)
    setSending(true)
    setError(null)
    setTxid(null)
    try {
      const r = await fetch(`${API}/api/mint-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privkey: wallet.privkey,
          fromAddress: wallet.address,
          toAddress: TREASURY,
          amount: parseFloat(totalCost)
        })
      })
      const data = await r.json()
      if (data.ok) {
        setTxid(data.txid)
      } else {
        setError(data.error || 'Transaction failed')
      }
    } catch (e) {
      setError(e.message)
    }
    setSending(false)
  }

  return (
    <>
      <section className="mint-section" id="mint">
        <div className="mint-container">
          <div className="mystery-box">
            <div className="box-ambient"/>
            <div className="box-inner">
              <video className="box-img" autoPlay loop muted playsInline>
                <source src="https://gold-faithful-guan-207.mypinata.cloud/ipfs/bafybeih757ea3isfe76f5k7ypdtxwu7swnfkmqqutaz5tsgyttpb6nxuly" type="video/mp4"/>
              </video>
            </div>
          </div>

          <div className="mint-right">
            <h2 className="mint-title">Mint Pearl Cats</h2>
            <p className="mint-desc">One payment. One unique cat. Yours forever on Pearl blockchain.</p>

            <div className="progress-section">
              <div className="progress-header">
                <span>{stats.minted} minted</span>
                <span>{stats.total - stats.minted} remaining</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${progress}%`}}/>
              </div>
            </div>

            <div className="mint-amount">
              <label>Amount</label>
              <div className="amount-controls">
                <button onClick={() => setAmount(Math.max(1, amount-1))}>−</button>
                <span>{amount}</span>
                <button onClick={() => setAmount(Math.min(10, amount+1))}>+</button>
              </div>
              <div className="total-cost">{totalCost} PRL</div>
            </div>

            <div className="wallet-limit">
              <span>Max 10 NFTs per wallet</span>
            </div>

            {!wallet ? (
              <button className="btn-mint" onClick={onOpenWallet}>Connect Wallet to Mint</button>
            ) : txid ? (
              <div className="mint-success">
                <div className="success-title">Minted! Your Pearl Cat is on its way.</div>
                <div className="success-txid">TX: {txid.slice(0,16)}...</div>
                <button className="btn-mint-again" onClick={() => { setTxid(null); setError(null); }}>Mint Another</button>
              </div>
            ) : (
              <button className="btn-mint active" onClick={handleMint} disabled={sending}>
                {sending ? 'Minting...' : `Mint ${amount} Pearl Cat${amount>1?'s':''} · ${totalCost} PRL`}
              </button>
            )}

            {error && <div className="mint-error">{error}</div>}
            <p className="mint-note">Delivered within 1–2 blocks (~2 min) after payment</p>
          </div>
        </div>
      </section>

      {showConfirm && createPortal(
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <div className="confirm-title">Confirm Mint</div>
            <div className="confirm-desc">
              You are about to mint <strong>{amount} Pearl Cat{amount>1?'s':''}</strong>
            </div>
            <div className="confirm-amount">{totalCost} PRL</div>
            <div className="confirm-note">Payment will be sent to treasury. Your Pearl Cat will arrive within 2 minutes.</div>
            <div className="confirm-buttons">
              <button className="btn-cancel" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn-confirm" onClick={confirmMint}>Confirm</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
