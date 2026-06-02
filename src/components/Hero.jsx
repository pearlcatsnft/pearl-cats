import React from 'react'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-orbs">
        <div className="orb orb1"/>
        <div className="orb orb2"/>
        <div className="orb orb3"/>
        <div className="orb orb4"/>
      </div>
      <div className="hero-content">
        <div className="hero-badge">Live on Pearl Blockchain</div>
        <h1 className="hero-title">
          Pearl Cats<br/>
          <span className="gradient-text">NFT Collection</span>
        </h1>
        <p className="hero-desc">
          The cutest cats on the blockchain — each one unique,
          holographic, and yours forever. Only 7,777 exist.
        </p>
        <div className="hero-stats">
          <div className="stat"><span className="stat-num">7,777</span><span className="stat-label">Total Supply</span></div>
          <div className="stat-divider"/>
          <div className="stat"><span className="stat-num">0.77 PRL</span><span className="stat-label">Mint Price</span></div>
          <div className="stat-divider"/>
          <div className="stat"><span className="stat-num">On-Chain</span><span className="stat-label">Inscriptions</span></div>
        </div>
        <a href="#mint" className="btn-hero">Mint Your Cat</a>
      </div>
    </section>
  )
}
