import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Mint from './pages/Mint'
import Marketplace from './pages/Marketplace'
import Profile from './pages/Profile'
import WalletModal from './components/WalletModal'
import './App.css'

export default function App() {
  const [wallet, setWallet] = useState(null)
  const [showWallet, setShowWallet] = useState(false)
  const [mintStats, setMintStats] = useState({ minted: 0, total: 7777, price: 0.77 })

  useEffect(() => {
    const saved = localStorage.getItem('pearlcats_wallet')
    if (saved) { try { setWallet(JSON.parse(saved)) } catch {} }
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const r = await fetch('https://api.pearlcatsnft.com/api/display-stats')
      const data = await r.json()
      setMintStats({ minted: data.minted, total: data.totalSupply, price: data.mintPrice })
    } catch {}
  }

  function saveWallet(w) {
    setWallet(w)
    localStorage.setItem('pearlcats_wallet', JSON.stringify(w))
  }

  function disconnectWallet() {
    setWallet(null)
    localStorage.removeItem('pearlcats_wallet')
  }

  return (
    <div className="app">
      <Navbar wallet={wallet} onOpenWallet={() => setShowWallet(true)} onDisconnect={disconnectWallet}/>
      <Routes>
        <Route path="/" element={<Home stats={mintStats}/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/mint" element={<Mint wallet={wallet} stats={mintStats} onOpenWallet={() => setShowWallet(true)}/>}/>
        <Route path="/marketplace" element={<Marketplace/>}/>
        <Route path="/profile" element={<Profile wallet={wallet} onOpenWallet={() => setShowWallet(true)}/>}/>
      </Routes>
      <Footer/>
      {showWallet && (
        <WalletModal wallet={wallet} onSave={saveWallet} onClose={() => setShowWallet(false)}/>
      )}
    </div>
  )
}
