import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'
import MobileMenu from './MobileMenu'

export default function Navbar({ wallet, onOpenWallet, onDisconnect }) {
  const shortAddr = wallet ? wallet.address.slice(0,8) + '...' + wallet.address.slice(-6) : null
  const location = useLocation()
  const active = (path) => location.pathname === path ? 'active' : ''

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="logo-link">
          <img src="/favicon.png" className="logo-icon-img" alt="Pearl Cats"/>
          <span className="logo-text">Pearl Cats</span>
        </Link>
        <div className="logo-divider"/>
        <div className="pearl-badge">
          <img src="/pearl-logo.jpg" alt="Pearl" className="pearl-logo-img"/>
          <span className="pearl-label">on Pearl</span>
        </div>
      </div>
      <div className="navbar-links">
        <Link to="/about" className={active('/about')}>About</Link>
        <Link to="/mint" className={active('/mint')}>Mint</Link>
        <Link to="/marketplace" className={active('/marketplace')}>Marketplace</Link>
        <a href="https://explorer.pearlresearch.ai/?network=mainnet" target="_blank">Explorer</a>
      </div>
      <div className="navbar-wallet">
        {wallet ? (
          <div className="wallet-connected">
            <Link to="/profile" className="wallet-addr"><img src="/favicon.png" className="wallet-favicon" alt=""/>{shortAddr}</Link>
            <button className="btn-disconnect" onClick={onDisconnect}>✕</button>
          </div>
        ) : (
          <button className="btn-connect" onClick={onOpenWallet}>Connect Wallet</button>
        )}
      </div>
      <MobileMenu/>
    </nav>
  )
}
