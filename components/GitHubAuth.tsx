'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Repo {
  full_name: string
  name: string
}

interface Props {
  dark?: boolean
}

const GH_ICON = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
)

export default function GitHubAuth({ dark = false }: Props) {
  const { data: session, status } = useSession()
  const [repos, setRepos] = useState<Repo[]>([])
  const [selected, setSelected] = useState('')
  const [loadingRepos, setLoadingRepos] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!session) return
    setLoadingRepos(true)
    fetch('/api/user/repos')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRepos(data)
          if (data.length > 0) setSelected(data[0].full_name)
        }
      })
      .finally(() => setLoadingRepos(false))
  }, [session])

  function handleAnalyze() {
    if (!selected) return
    const [owner, repo] = selected.split('/')
    router.push(`/dashboard/${owner}/${repo}`)
  }

  const pillBg = dark ? 'rgba(255,255,255,0.12)' : 'var(--bg-surface)'
  const pillBorder = dark ? 'rgba(255,255,255,0.16)' : 'var(--border-strong)'
  const textColor = dark ? 'rgba(255,255,255,0.7)' : 'var(--text-faint)'

  if (status === 'loading') {
    return (
      <div style={{
        height: 50, borderRadius: 9999, background: pillBg, border: `1.5px solid ${pillBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 12, color: textColor }}>
          loading<span className="blink">_</span>
        </span>
      </div>
    )
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn('github')}
        style={{
          width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          background: '#FFFFFF',
          color: '#0A0A0A',
          border: '1.5px solid rgba(0,0,0,0.14)',
          padding: '14px 28px',
          borderRadius: 9999,
          fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
          fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
          cursor: 'pointer',
          minHeight: 50,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.1s',
        }}
      >
        {GH_ICON}
        Sign in with GitHub
        <span style={{ opacity: 0.35, marginLeft: 2, fontSize: 13 }}>→</span>
      </button>
    )
  }

  return (
    <div>
      {/* Repo select + analyze */}
      <div style={{
        display: 'flex',
        background: dark ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
        border: `1.5px solid ${pillBorder}`,
        borderRadius: 9999,
        overflow: 'hidden',
        boxShadow: dark ? 'none' : 'var(--shadow-sm)',
        transition: 'border-color 0.15s',
      }}>
        <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          disabled={loadingRepos}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '14px 16px 14px 20px',
            fontFamily: 'var(--font-ibm-plex-mono)',
            fontSize: 13,
            color: loadingRepos
              ? textColor
              : dark ? 'rgba(255,255,255,0.9)' : 'var(--text-primary)',
            cursor: 'pointer',
            appearance: 'none',
            minWidth: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239CA3AF' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 14px center',
            paddingRight: 36,
          }}
        >
          {loadingRepos
            ? <option>Loading repos…</option>
            : repos.map(r => <option key={r.full_name} value={r.full_name}>{r.full_name}</option>)
          }
        </select>
        <button
          onClick={handleAnalyze}
          disabled={loadingRepos}
          style={{
            background: 'var(--cta-bg)', color: 'white', border: 'none',
            padding: '0 22px', fontSize: 13, fontWeight: 600,
            cursor: loadingRepos ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-geist-sans)',
            borderRadius: '0 9999px 9999px 0',
            opacity: loadingRepos ? 0.5 : 1,
            transition: 'background 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          Analyze →
        </button>
      </div>

      {/* User info + sign out */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 12 }}>
        <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11, color: textColor }}>
          {session.user?.name ?? session.user?.email}
        </span>
        <button
          onClick={() => signOut()}
          style={{
            fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11,
            color: textColor, background: 'none', border: 'none',
            cursor: 'pointer', textDecoration: 'underline', padding: 0,
          }}
        >
          sign out
        </button>
      </div>
    </div>
  )
}
