import React from 'react'
import './MarketplaceTeaser.css'

export default function MarketplaceTeaser() {
  return (
    <section className="marketplace-teaser" id="marketplace">
      <div className="teaser-content">
        <div className="teaser-badge">Coming Soon</div>
        <h2 className="teaser-title">
          Pearl Cats<br/>
          <span className="gradient-text">Marketplace</span>
        </h2>
        <p className="teaser-desc">
          Buy, sell, and trade Pearl Cats NFTs.<br/>
          Fixed price listings & auctions — fully P2P on Pearl blockchain.
        </p>
        <div className="teaser-features">
          <div className="feature"><span className="feature-icon"></span><span>Fixed Price</span></div>
          <div className="feature"><span className="feature-icon"></span><span>Auctions</span></div>
          <div className="feature"><span className="feature-icon"></span><span>Instant P2P</span></div>
          <div className="feature"><span className="feature-icon"></span><span>Non-Custodial</span></div>
        </div>
      </div>
      <div className="teaser-visual">
        <div className="mock-card">
          <img src="/sneak1.jpg" className="mock-img-real" alt="Pearl Cat"/>
          <div className="mock-name">Pearl Cat #???</div>
          <div className="mock-price">? PRL</div>
        </div>
        <div className="mock-card offset">
          <img src="/sneak2.jpg" className="mock-img-real" alt="Pearl Cat"/>
          <div className="mock-name">Pearl Cat #???</div>
          <div className="mock-price">? PRL</div>
        </div>
        <div className="mock-card offset2">
          <img src="/sneak3.jpg" className="mock-img-real" alt="Pearl Cat"/>
          <div className="mock-name">Pearl Cat #???</div>
          <div className="mock-price">? PRL</div>
        </div>
      </div>
    </section>
  )
}
