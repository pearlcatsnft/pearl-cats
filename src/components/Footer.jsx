import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-logo">Pearl Cats</span>
          <p className="footer-tagline">7,777 unique cats on Pearl blockchain</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <div className="footer-col-title">Collection</div>
            <Link to="/mint">Mint</Link>
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/about">About</Link>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Resources</div>
            <a href="https://explorer.pearlresearch.ai/?network=mainnet" target="_blank">Explorer</a>
            <a href="https://pearlchain.org" target="_blank">Pearl Chain</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Community</div>
            <a href="https://twitter.com" target="_blank">Twitter / X</a>
            <a href="https://discord.gg" target="_blank">Discord</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Pearl Cats. All rights reserved.</span>
        <span>Built on Pearl Blockchain</span>
      </div>
    </footer>
  )
}
