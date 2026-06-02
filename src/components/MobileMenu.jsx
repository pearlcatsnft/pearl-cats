import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './MobileMenu.css'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  return (
    <div className="mobile-menu">
      <button className="hamburger" onClick={() => setOpen(!open)}>
        <span className="bar"/><span className="bar"/><span className="bar"/>
      </button>
      {open && (
        <div className="mobile-dropdown" onClick={() => setOpen(false)}>
          <Link to="/about">About</Link>
          <Link to="/mint">Mint</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/profile">My Profile</Link>
          <a href="https://explorer.pearlresearch.ai/?network=mainnet" target="_blank">Explorer</a>
        </div>
      )}
    </div>
  )
}
