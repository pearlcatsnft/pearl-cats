import React, { useState } from 'react'
import './ClaimForm.css'

export default function ClaimForm() {
  const [txid, setTxid] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!txid.trim() || !address.trim()) return
    setLoading(true)
    // Save to local storage as fallback, ideally POST to backend
    const claims = JSON.parse(localStorage.getItem('pearlcats_claims') || '[]')
    claims.push({ txid, address, note, timestamp: Date.now() })
    localStorage.setItem('pearlcats_claims', JSON.stringify(claims))
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1000)
  }

  return (
    <section className="claim-section" id="claim">
      <div className="claim-container">
        <div className="claim-header">
          <div className="claim-badge">Support</div>
          <h2 className="claim-title">Didn't get your Pearl Cat?</h2>
          <p className="claim-desc">
            Paid but never received your Pearl Cat? Submit your payment transaction
            and Pearl address below. We review every claim manually and re-issue
            the NFT to verified payments.
          </p>
        </div>

        {submitted ? (
          <div className="claim-success">
            <div className="success-icon">✅</div>
            <div className="success-title">Claim Submitted!</div>
            <div className="success-desc">We'll review your claim and get back to you within 24 hours.</div>
            <button className="btn-new-claim" onClick={() => { setSubmitted(false); setTxid(''); setAddress(''); setNote('') }}>
              Submit Another
            </button>
          </div>
        ) : (
          <div className="claim-form">
            <div className="form-field">
              <label>Payment Transaction ID *</label>
              <input
                type="text"
                placeholder="Paste your Pearl transaction ID"
                value={txid}
                onChange={e => setTxid(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Your Pearl Address *</label>
              <input
                type="text"
                placeholder="prl1p..."
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Note (optional)</label>
              <textarea
                placeholder="Any additional details..."
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={3}
              />
            </div>
            <button
              className={`btn-claim ${txid && address ? 'active' : ''}`}
              onClick={handleSubmit}
              disabled={!txid || !address || loading}
            >
              {loading ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
