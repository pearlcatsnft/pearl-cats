import React, { useState } from 'react'
import './FAQ.css'

const faqs = [
  { q: "What is Pearl Cats?", a: "Pearl Cats is a collection of 7,777 unique holographic cats permanently inscribed on the Pearl blockchain using the pearlscription protocol." },
  { q: "How do I mint?", a: "Connect your Pearl wallet, then send exactly 0.77 PRL to our treasury address. Your Pearl Cat will be automatically inscribed and sent to your wallet within 1-2 blocks (~2 minutes)." },
  { q: "What is a pearlscription?", a: "Pearlscriptions are the first NFT standard on Pearl blockchain, similar to Bitcoin Ordinals. Your NFT data is inscribed directly on-chain, making it permanent and immutable." },
  { q: "When is the reveal?", a: "Pearl Cats use a blind mint (mystery box). All cats will be revealed 24 hours after the collection sells out." },
  { q: "How many Pearl Cats exist?", a: "Only 7,777 Pearl Cats will ever exist. Each one is unique with different trait combinations." },
  { q: "Do I need a Pearl wallet?", a: "Yes. You can create one directly on this website by clicking 'Connect Wallet' — no extension needed." },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <section className="faq" id="faq">
      <div className="faq-container">
        <div className="faq-header">
          <div className="faq-badge">FAQ</div>
          <h2 className="faq-title">Frequently Asked<br/><span className="gradient-text">Questions</span></h2>
        </div>
        <div className="faq-list">
          {faqs.map((item, i) => (
            <div key={i} className={`faq-item ${open===i?'open':''}`} onClick={() => setOpen(open===i?null:i)}>
              <div className="faq-q">
                <span>{item.q}</span>
                <span className="faq-arrow">{open===i?'↑':'↓'}</span>
              </div>
              {open===i && <div className="faq-a">{item.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
