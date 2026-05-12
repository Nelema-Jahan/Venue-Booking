'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('')
  const [name, setName] = useState(''); const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(null)
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/bookings`,
      },
    })
    setLoading(false)
    if (error) return setError(error.message)
    router.push('/bookings')
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-20 max-w-sm space-y-4 p-6 border rounded-lg">
      <h1 className="text-2xl font-bold">Create account</h1>
      <div><Label>Full name</Label><Input value={name} onChange={e => setName(e.target.value)} required /></div>
      <div><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
      <div><Label>Password</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={6} required /></div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">{loading ? '...' : 'Sign up'}</Button>
    </form>
  )
}
