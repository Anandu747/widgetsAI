/* eslint-disable */
'use client';
import { useEffect, useRef, useState, FormEvent } from 'react';
import { CATS, PRODUCTS, Product } from '@/lib/products';
import { brain, total, Cart, Tab } from '@/lib/brain';
import Icon from './Icons';

type Msg = { r: 'u' | 'b'; t: string; time: string; items?: Product[] };
const f = (n: number) => '$' + n.toFixed(2);
const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const BARS = [6, 12, 18, 10, 22, 14, 8, 20, 12, 6, 16, 22, 10, 14, 8, 18, 12, 6];
const CHIPS = ['Under $50', 'Headphones', 'Smart Home', 'For Work'];

function PImg({ p, thumb = false }: { p: Product; thumb?: boolean }) {
  const [bad, setBad] = useState(false);
  return (
    <div className={`pimg ${thumb ? 'thumb' : ''}`}>
         {bad || !p.img ? <Icon name={p.icon} size={thumb ? 22 : 40} /> : <img src={p.img} alt={p.name} loading="lazy" onError={() => setBad(true)} />}
    </div>
  );
}

function Card({ p, onAdd, wished, onWish }: { p: Product; onAdd: (id: number) => void; wished: boolean; onWish: (id: number) => void }) {
  return (
    <div className="card">
      <div className="pwrap">
        <PImg p={p} />
        <button className={`heart ${wished ? 'on' : ''}`} aria-label="Wishlist" onClick={() => onWish(p.id)}><Icon name="heart" size={15} /></button>
      </div>
      <b className="pn">{p.name}</b>
      <small>{p.d}</small>
      <b className="price">{f(p.price)}</b>
      <button className="btn full" onClick={() => onAdd(p.id)}><Icon name="cart" size={16} />Add to cart</button>
    </div>
  );
}

export default function ChatWidget({ title = 'ShopBot', embedded = false }: { title?: string; embedded?: boolean }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('chat');
  const [msgs, setMsgs] = useState<Msg[]>([{ r: 'b', t: `Hi! I'm ${title}. Ask me about products by typing, or tap the mic and talk to me.`, time: now() }]);
  const [cart, setCart] = useState<Cart>({});
  const [loaded, setLoaded] = useState(false);
  const [wish, setWish] = useState<number[]>([]);
  const [voice, setVoice] = useState(true);
  const [listening, setListening] = useState(false);
  const [filter, setFilter] = useState('all');
  const [input, setInput] = useState('');
  const [order, setOrder] = useState<{ id: string; n: string; t: number } | null>(null);
  const rec = useRef<any>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef(cart); cartRef.current = cart;
  const voiceRef = useRef(voice); voiceRef.current = voice;
  const sendRef = useRef<(t: string) => void>(() => {});

  useEffect(() => { try { setCart(JSON.parse(localStorage.getItem('aiw_cart') || '{}')); } catch {} setLoaded(true); }, []);
  useEffect(() => { if (loaded) { try { localStorage.setItem('aiw_cart', JSON.stringify(cart)); } catch {} } }, [cart, loaded]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, tab, open]);
  useEffect(() => { if (embedded) window.parent.postMessage({ aiw: 'toggle', open }, '*'); }, [open, embedded]);

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const addCart = (id: number) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const decCart = (id: number) => setCart(c => { const n = { ...c, [id]: c[id] - 1 }; if (n[id] <= 0) delete n[id]; return n; });
  const toggleWish = (id: number) => setWish(w => (w.includes(id) ? w.filter(x => x !== id) : [...w, id]));

  function speak(t: string) {
    if (!voiceRef.current || !('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t.replace(/[^\w\s.,!?$'-]/g, '')); u.rate = 1.05;
    speechSynthesis.speak(u);
  }
  const say = (t: string, items?: Product[]) => { setMsgs(m => [...m, { r: 'b', t, items, time: now() }]); speak(t); };

  async function send(text: string) {
    text = text.trim(); if (!text) return;
    setInput(''); setTab('chat'); setMsgs(m => [...m, { r: 'u', t: text, time: now() }]);
    const r = await brain(text, cartRef.current);
    if (r.add) addCart(r.add);
    if (r.go) setTab(r.go);
    say(r.t, r.items);
  }
  sendRef.current = send;

  function toggleMic() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return say('Voice input is not supported in this browser. Please use Chrome or Edge.');
    if (listening) return rec.current?.stop();
    speechSynthesis.cancel();
    const r = new SR(); r.lang = 'en-US'; r.interimResults = true;
    r.onstart = () => setListening(true);
    r.onresult = (e: any) => {
      const t = Array.from(e.results).map((x: any) => x[0].transcript).join('');
      setInput(t);
      if (e.results[e.results.length - 1].isFinal) sendRef.current(t);
    };
    r.onend = () => setListening(false);
    r.onerror = (e: any) => { setListening(false); say(e.error === 'not-allowed' ? 'Microphone permission was denied.' : "Sorry, I couldn't hear that. Try again."); };
    rec.current = r; r.start();
  }

  function placeOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const n = String(new FormData(e.currentTarget).get('n'));
    setOrder({ id: 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase(), n, t: total(cart) });
    setCart({}); setTab('done'); speak(`Thanks ${n}, your order is confirmed.`);
  }

  const tabBtn = (t: Tab, label: string, icon: string) => (
    <button className={tab === t || (t === 'cart' && tab === 'checkout') ? 'on' : ''} onClick={() => setTab(t)}>
      <Icon name={icon} size={18} />{label}{t === 'cart' && count > 0 && <i className="cn">{count}</i>}
    </button>
  );
  const cardProps = { onAdd: addCart, onWish: toggleWish };

  return (
    <div className="aiw">
      <button className="fab" aria-label="Open chat" onClick={() => { setOpen(o => !o); if (open) speechSynthesis?.cancel(); }}>
        <Icon name={open ? 'x' : 'message'} size={26} />
        {count > 0 && <span className="badge">{count}</span>}
      </button>
      {open && (
        <section className="panel">
          <header>
            <div className="bav"><Icon name="bot" size={26} /></div>
            <div className="ht"><b>{title}</b><small>Your personal shopping assistant</small></div>
            <div className="hbtns">
              <button title="Toggle voice replies" aria-label="Toggle voice replies" onClick={() => { setVoice(v => !v); speechSynthesis?.cancel(); }}>
                <Icon name={voice ? 'volume' : 'volumeOff'} size={20} />
              </button>
              <button aria-label="Close" onClick={() => setOpen(false)}><Icon name="x" size={20} /></button>
            </div>
          </header>
          <nav>{tabBtn('chat', 'Chat', 'message')}{tabBtn('shop', 'Shop', 'bag')}{tabBtn('cart', 'Cart', 'cart')}</nav>
          <main>
            {tab === 'chat' && msgs.map((m, i) => (
              <div key={i}>
                <div className={`mw ${m.r}`}>
                  <div className="av"><Icon name={m.r === 'b' ? 'bot' : 'user'} size={16} /></div>
                  <div className="mc"><div className={`m ${m.r}`}>{m.t}</div><div className="ts">{m.time}</div></div>
                </div>
                {m.items && <div className="mini">{m.items.map(p => <Card key={p.id} p={p} wished={wish.includes(p.id)} {...cardProps} />)}</div>}
              </div>
            ))}
            {tab === 'shop' && <>
              <div className="chips">{CATS.map(c => <button key={c} className={`chip ${filter === c ? 'on' : ''}`} onClick={() => setFilter(c)}>{c}</button>)}</div>
              <div className="grid">{PRODUCTS.filter(p => filter === 'all' || p.cat === filter).map(p => <Card key={p.id} p={p} wished={wish.includes(p.id)} {...cardProps} />)}</div>
            </>}
            {tab === 'cart' && (count ? <>
              {Object.entries(cart).map(([id, q]) => {
                const p = PRODUCTS.find(x => x.id === +id)!;
                return (
                  <div className="line" key={id}>
                    <PImg p={p} thumb />
                    <div className="li"><b>{p.name}</b><span>{f(p.price)}</span></div>
                    <div className="q">
                      <button aria-label="Decrease" onClick={() => decCart(p.id)}><Icon name="minus" size={14} /></button>
                      {q}
                      <button aria-label="Increase" onClick={() => addCart(p.id)}><Icon name="plus" size={14} /></button>
                    </div>
                  </div>
                );
              })}
              <div className="tot"><span>Total</span><span>{f(total(cart))}</span></div>
              <button className="btn full big" onClick={() => setTab('checkout')}>Checkout</button>
            </> : <div className="empty"><Icon name="cart" size={40} />Your cart is empty</div>)}
            {tab === 'checkout' && (
              <form onSubmit={placeOrder}>
                <b>Checkout</b> <small className="mu">(demo, no real payment)</small>
                <input name="n" placeholder="Full name" required />
                <input name="e" type="email" placeholder="Email" required />
                <input name="a" placeholder="Delivery address" required />
                <input name="c" placeholder="Card 4242 4242 4242 4242" pattern="[0-9 ]{13,19}" required />
                <div className="tot"><span>Pay</span><span>{f(total(cart))}</span></div>
                <button className="btn full big">Place order</button>
              </form>
            )}
            {tab === 'done' && order && (
              <div className="ok">
                <div className="big"><Icon name="check" size={56} /></div>
                <h3>Order confirmed!</h3>
                <p>Thanks {order.n}. Order <b>{order.id}</b> for {f(order.t)} is on its way (mock).</p>
                <button className="btn full big" onClick={() => setTab('shop')}>Continue shopping</button>
              </div>
            )}
            <div ref={endRef} />
          </main>
          {tab === 'chat' && (
            <div className="foot">
              <div className="qchips">{CHIPS.map(c => <button key={c} className="qchip" onClick={() => send(c)}>{c}</button>)}</div>
              <div className="bar">
                <button className={`micb ${listening ? 'rec' : ''}`} title="Speak" aria-label="Speak" onClick={toggleMic}><Icon name="mic" size={22} /></button>
                <div className="vw">
                  <div className={`wave ${listening ? 'on' : ''}`}>{BARS.map((h, i) => <i key={i} style={{ height: h, animationDelay: `${i * 60}ms` }} />)}</div>
                  <span className="vs"><u />{listening ? 'Listening…' : voice ? 'Voice ready' : 'Voice replies off'}</span>
                </div>
                <input value={input} placeholder="Ask about products…" onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)} />
                <button className="sendb" aria-label="Send" onClick={() => send(input)}><Icon name="send" size={18} /></button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}