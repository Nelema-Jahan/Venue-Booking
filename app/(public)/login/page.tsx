'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter(); const supabase = createClient()
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null); const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return setError('Email or password is incorrect.')
      }
      if (error.message.includes('rate limit')) {
        return setError('Too many login attempts. Please try again in 15 minutes.')
      }
      return setError(error.message)
    }
    router.push('/dashboard/bookings'); router.refresh()
  }

  async function google() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-20 max-w-sm space-y-4 p-6 border rounded-lg">
      <h1 className="text-2xl font-bold">Log in</h1>
      <div><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
      <div><Label>Password</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">{loading ? '...' : 'Log in'}</Button>
      <Button type="button" variant="outline" className="w-full" onClick={google}>Continue with Google</Button>
    </form>
  )
}
