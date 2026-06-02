import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Profile.css'

export default function Profile({ wallet, onOpenWallet }) {
  const [nfts, setNfts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (wallet?.address) fetchNFTs()
  }, [wallet])

  async function fetchNFTs() {
    setLoading(true)
    try {
      const r = await fetch(`https://api.pearlcatsnft.com/api/nfts/${wallet.address}`)
      const data = await r.json()
      setNfts(data.nfts || [])
    } catch {}
    setLoading(false)
  }

  if (!wallet) {
    return (
      <main className="profile-page">
        <div className="profile-empty">
          <div className="empty-icon"></div>
          <h2>Connect Your Wallet</h2>
          <p>Connect your Pearl wallet to view your cats</p>
          <button className="btn-connect-profile" onClick={onOpenWallet}>Connect Wallet</button>
        </div>
      </main>
    )
  }

  return (
    <main className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar"></div>
          <div className="profile-info">
            <div className="profile-address-row">
            <span className="profile-address">{wallet.address}</span>
            <button className="btn-copy-addr" onClick={() => navigator.clipboard.writeText(wallet.address).then(() => alert("Copied!"))}>Copy</button>
          </div>
            <div className="profile-badge">{nfts.length} Pearl Cat{nfts.length !== 1 ? 's' : ''}</div>
          </div>
        </div>

        {loading ? (
          <div className="profile-loading">Loading your cats...</div>
        ) : nfts.length === 0 ? (
          <div className="profile-no-nfts">
            <div className="no-nfts-img"><img src="/mystery-box.jpg" alt="" style={{width:120,opacity:0.5}}/></div>
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
                  <div className="nft-id">#{nft.inscriptionNumber || '???'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
