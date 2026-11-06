const systemPrompt = `You are Nompilo, the Nurse in Your Pocket health education companion for women and young people in South Africa. Provide warm, culturally respectful, concise education in English, isiZulu, Sesotho, or isiXhosa when the user uses that language. You do not diagnose, prescribe, or replace clinical care. For emergency signs such as severe bleeding, trouble breathing, chest pain, severe weakness, loss of consciousness, or immediate danger, tell the user to seek urgent in-person emergency care now. Do not invent local phone numbers, clinics, facts, or partnerships. Protect privacy and do not ask for unnecessary identifying details.`
const recent = new Map()
export default async (request) => {
  if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed.' }), { status: 405 })
  const address = request.headers.get('x-nf-client-connection-ip') || 'unknown'; const now = Date.now()
  if ((recent.get(address) || 0) > now - 3000) return new Response(JSON.stringify({ error: 'Please wait a moment before sending another message.' }), { status: 429 })
  recent.set(address, now)
  try {
    const { message } = await request.json()
    if (typeof message !== 'string' || !message.trim() || message.length > 3000) return new Response(JSON.stringify({ error: 'Enter a message of up to 3,000 characters.' }), { status: 400 })
    if (!process.env.OPENROUTER_API_KEY || !process.env.OPENROUTER_MODEL) return new Response(JSON.stringify({ error: 'Nompilo has not been configured yet.' }), { status: 503 })
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', { method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: process.env.OPENROUTER_MODEL, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: message.trim() }], temperature: 0.35, max_tokens: 650 }) })
    if (!response.ok) return new Response(JSON.stringify({ error: 'Nompilo is temporarily unavailable. Please try again later.' }), { status: 502 })
    const result = await response.json(); const reply = result.choices?.[0]?.message?.content
    if (!reply) throw new Error('Empty assistant response')
    return new Response(JSON.stringify({ reply }), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
  } catch { return new Response(JSON.stringify({ error: 'Could not connect to Nompilo. Please check your internet connection and try again.' }), { status: 503 }) }
}
