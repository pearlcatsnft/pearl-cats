import React, { useState } from 'react'
import './MintSection.css'

const TREASURY = 'prl1ppprdt49dyv2am07fyuykfs3f6r3cgfcsa5fwc2sqnszuhlrcqyqs9v5j8u'
const MINT_PRICE = 0.77

export default function MintSection({ wallet, stats, onOpenWallet }) {
  const [copied, setCopied] = useState(false)
  const [amount, setAmount] = useState(1)
  const progress = (stats.minted / stats.total) * 100
  const totalCost = (amount * MINT_PRICE).toFixed(2)

  function copyTreasury() {
    navigator.clipboard.writeText(TREASURY)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
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
          ) : (
            <button className="btn-mint active" onClick={copyTreasury}>
              {copied ? '✓ Address Copied!' : `Mint · ${totalCost} PRL`}
            </button>
          )}
          <p className="mint-note">Delivered within 1–2 blocks (~2 min) after payment</p>
        </div>
      </div>
    </section>
  )
}
