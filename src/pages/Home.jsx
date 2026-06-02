import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'
import SneakPeek from '../components/SneakPeek'

export default function Home({ stats }) {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-orbs">
          <div className="orb orb1"/><div className="orb orb2"/>
          <div className="orb orb3"/><div className="orb orb4"/>
        </div>
        <div className="hero-content">
          <div className="hero-badge">Live on Pearl Blockchain</div>
          <h1 className="hero-title">
            Pearl Cats<br/>
            <span className="gradient-text">NFT Collection</span>
          </h1>
          <p className="hero-desc">
            The cutest cats on the blockchain — each one unique,<br/>
            holographic, and yours forever. Only 7,777 exist.
          </p>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">7,777</span><span className="stat-label">Total Supply</span></div>
            <div className="stat-divider"/>
            <div className="stat"><span className="stat-num">0.77 PRL</span><span className="stat-label">Mint Price</span></div>
            <div className="stat-divider"/>
            <div className="stat"><span className="stat-num">{stats.minted}</span><span className="stat-label">Minted</span></div>
          </div>
          <div className="hero-actions">
            <Link to="/mint" className="btn-primary">Mint Your Cat</Link>
            <Link to="/about" className="btn-secondary">Learn More</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-box">
            <img src="/blindbox.gif" alt="Pearl Cat" className="hero-img"/>
            
          </div>
        </div>
      </section>
      <SneakPeek/>
    </main>
  )
}
