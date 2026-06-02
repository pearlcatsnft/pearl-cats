import React from 'react'
import MintSection from '../components/MintSection'
import ClaimForm from '../components/ClaimForm'
import FAQ from '../components/FAQ'
import './Mint.css'

export default function Mint({ wallet, stats, onOpenWallet }) {
  return (
    <main className="mint-page">
      <MintSection wallet={wallet} stats={stats} onOpenWallet={onOpenWallet}/>
      <ClaimForm/>
      <FAQ/>
    </main>
  )
}
