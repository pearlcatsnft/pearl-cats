import React from 'react'
import './SneakPeek.css'

const images = [
  '/sneak1.jpg', '/sneak2.jpg', '/sneak3.jpg',
  '/s1.jpeg', '/s2.jpeg', '/s3.jpeg', '/s4.jpeg', '/s5.jpeg',
]

export default function SneakPeek() {
  // Duplicate for seamless loop
  const doubled = [...images, ...images]

  return (
    <section className="sneak-peek">
      <div className="sneak-header">
        <div className="sneak-badge">Sneak Peek</div>
        <h2 className="sneak-title">Meet the <span className="gradient-text">Pearl Cats</span></h2>
        <p className="sneak-desc">A glimpse of what's coming. Full collection reveals 24h after sold out.</p>
      </div>
      <div className="marquee-wrapper">
        <div className="marquee-fade-left"/>
        <div className="marquee-fade-right"/>
        <div className="marquee-track">
          {doubled.map((src, i) => (
            <div key={i} className="marquee-card">
              <img src={src} alt={`Pearl Cat ${i+1}`}/>
              <div className="marquee-glow"/>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
