import React from 'react'
import './About.css'

export default function About() {
  return (
    <section className="about" id="about">
      <div className="about-container">
        <div className="about-text">
          <div className="about-badge">About</div>
          <h2 className="about-title">What is<br/><span className="gradient-text">Pearl Cats?</span></h2>
          <p className="about-desc">
            Pearl Cats is a collection of 7,777 unique holographic cats,
            each permanently inscribed on the Pearl blockchain as a
            pearlscription — the first NFT standard on Pearl.
          </p>
          <p className="about-desc">
            Every cat is one-of-a-kind, generated from hundreds of trait
            combinations. Once minted, your Pearl Cat lives on-chain forever —
            no servers, no IPFS dependencies, just pure blockchain permanence.
          </p>
          <div className="about-stats">
            <div className="astat"><span className="astat-num">7,777</span><span className="astat-label">Unique Cats</span></div>
            <div className="astat"><span className="astat-num">0.77</span><span className="astat-label">PRL per mint</span></div>
            <div className="astat"><span className="astat-num">∞</span><span className="astat-label">On-chain forever</span></div>
          </div>
        </div>
        <div className="about-visual">
          <div className="about-card">
            <img src="/mystery-box.jpg" alt="Pearl Cat" className="about-img"/>
            <div className="about-card-info">
              <div className="about-card-title">Pearl Cat #???</div>
              <div className="about-card-sub">Reveals 24 hours after sold out 🕐</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
