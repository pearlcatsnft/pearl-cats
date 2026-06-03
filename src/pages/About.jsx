import React from 'react'
import './About.css'
import SneakPeek from '../components/SneakPeek'

export default function About() {
  return (
    <main className="about-page">
      <div className="page-container">
        <div className="page-header">
          <div className="page-badge">About</div>
          <h1 className="page-title">What is <span className="gradient-text">Pearl Cats?</span></h1>
          <p className="page-desc">The first cat NFT inscribed on Pearl blockchain</p>
        </div>
        <div className="about-grid">
          <div className="about-card">
            <div className="about-card-icon">✦</div>
            <h3>Unique & On-Chain</h3>
            <p>Every Pearl Cat is permanently inscribed on the Pearl blockchain as a pearlscription. Your NFT lives on-chain forever — no servers, no IPFS dependencies.</p>
          </div>
          <div className="about-card">
            <div className="about-card-icon">✦</div>
            <h3>Holographic Art</h3>
            <p>Each cat features a unique holographic iridescent style, generated from hundreds of trait combinations across backgrounds, bodies, eyes, and accessories.</p>
          </div>
          <div className="about-card">
            <div className="about-card-icon">✦</div>
            <h3>Mystery Reveal</h3>
            <p>All Pearl Cats use a blind mint. You receive a mystery box at mint, and all cats are revealed together 24 hours after the collection sells out.</p>
          </div>
          <div className="about-card">
            <div className="about-card-icon">✦</div>
            <h3>Built on Pearl</h3>
            <p>Pearl is a Proof-of-Useful-Work L1 blockchain. Pearlscriptions are the native NFT standard — permanently inscribed in transaction witness data.</p>
          </div>
        </div>
        <div className="about-stats-row">
          <div className="big-stat"><span className="big-num">7,777</span><span className="big-label">Total Supply</span></div>
          <div className="big-stat"><span className="big-num">0.77</span><span className="big-label">PRL per mint</span></div>
          <div className="big-stat"><span className="big-num">24h</span><span className="big-label">After soldout reveal</span></div>
          <div className="big-stat"><span className="big-num">10</span><span className="big-label">Max per wallet</span></div>
        </div>
        <div className="about-visual">
          <video className="about-video" autoPlay loop muted playsInline><source src="https://gold-faithful-guan-207.mypinata.cloud/ipfs/bafybeicjbcokml424zdoxm5qwadbkqguxf2iok54mrtvu522xjlr4e2b2m" type="video/mp4"/></video><div className="about-sneak-grid" style={{display:"none"}}>
          <img src="/sneak1.jpg" alt="Pearl Cat"/>
          <img src="/sneak2.jpg" alt="Pearl Cat"/>
          <img src="/sneak3.jpg" alt="Pearl Cat"/>
          <img src="/s7.jpg" alt="Pearl Cat"/>
          <img src="/s8.jpg" alt="Pearl Cat"/>
          <img src="/s9.jpg" alt="Pearl Cat"/>
          <img src="/s10.jpg" alt="Pearl Cat"/>
          <img src="/s11.jpg" alt="Pearl Cat"/>
          <img src="/s12.jpg" alt="Pearl Cat"/>
          <img src="/s13.jpg" alt="Pearl Cat"/>
          <img src="/s14.jpg" alt="Pearl Cat"/>
          <img src="/s15.jpg" alt="Pearl Cat"/>
        </div>
          <div className="about-visual-text">
            <h2>The Collection</h2>
            <p>Pearl Cats are generated from multiple trait layers — backgrounds, body colors, eye styles, mouths, hats, accessories, and more. Each combination is unique and verified on-chain.</p>
            <p>After reveal, you'll discover your cat's rarity traits and how it compares to the rest of the collection.</p>
          </div>
        </div>
      </div>
      <SneakPeek/>
    </main>
  )
}
