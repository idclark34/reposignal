'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function RepoInput() {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  function parseRepo(input: string): { owner: string; repo: string } | null {
    const cleaned = input.trim().replace(/\/$/, '')
    const urlMatch = cleaned.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2] }
    const shortMatch = cleaned.match(/^([^/]+)\/([^/]+)$/)
    if (shortMatch) return { owner: shortMatch[1], repo: shortMatch[2] }
    return null
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const parsed = parseRepo(value)
    if (!parsed) {
      setError('Enter a GitHub URL or owner/repo — e.g. vercel/next.js')
      return
    }
    router.push(`/dashboard/${parsed.owner}/${parsed.repo}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="repo-input-wrap">
        <span className="repo-input-prefix">github.com /</span>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="owner / repo"
          className="repo-input-field"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <button type="submit" className="repo-submit">
          Analyze
        </button>
      </div>
      {error && (
        <p className="mono" style={{ marginTop: 8, fontSize: 11, color: 'var(--accent)' }}>
          ↳ {error}
        </p>
      )}
    </form>
  )
}
