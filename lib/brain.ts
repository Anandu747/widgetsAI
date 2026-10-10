import { PRODUCTS, Product } from './products';

export type Tab = 'chat' | 'shop' | 'cart' | 'checkout' | 'done';
export type Reply = { t: string; items?: Product[]; add?: number; go?: Tab };
export type Cart = Record<number, number>;

const f = (n: number) => '$' + n.toFixed(2);
const count = (c: Cart) => Object.values(c).reduce((a, b) => a + b, 0);
export const total = (c: Cart) =>
  Object.entries(c).reduce((a, [id, q]) => a + PRODUCTS.find(p => p.id === +id)!.price * q, 0);

const CAT_RE: Record<string, RegExp> = {
  audio: /audio|headphone|earbud|speaker|music|sound/,
  wearables: /wearable|watch|band|fitness/,
  accessories: /accessor|backpack|power ?bank|charger|bag/,
  home: /home|lamp|mug|kitchen/,
};

function find(text: string): Product | null {
  const w = text.toLowerCase().split(/\W+/).filter(x => x.length > 2);
  const scored = PRODUCTS.map(p => [w.filter(x => `${p.name} ${p.cat} ${p.d}`.toLowerCase().includes(x)).length, p] as const)
    .sort((a, b) => b[0] - a[0])[0];
  return scored && scored[0] ? scored[1] : null;
}

/**
 * Mock assistant (rule-based). To use a real LLM, replace this body with a
 * fetch('/api/chat') call that returns the same Reply shape.
 */
export async function brain(q: string, cart: Cart): Promise<Reply> {
  const s = q.toLowerCase();
  if (/^(hi|hello|hey)\b/.test(s)) return { t: 'Hi! I can show products, filter by category or price, and manage your cart. Try "headphones" or "under $50".' };
  if (/checkout|buy now|purchase|place order|pay\b/.test(s))
    return count(cart) ? { t: 'Taking you to checkout.', go: 'checkout' } : { t: 'Your cart is empty. Add something first!' };
  if (/cart|basket/.test(s))
    return { t: count(cart) ? `You have ${count(cart)} items totalling ${f(total(cart))}.` : 'Your cart is empty.', go: 'cart' };
  const add = s.match(/add (?:the |a |an |some )?(.+?)(?: to (?:my |the )?cart)?$/);
  if (add) {
    const p = find(add[1]);
    if (p) return { t: `Added ${p.name} to your cart. Say "checkout" when you're ready.`, add: p.id };
  }
  const under = s.match(/(?:under|below|less than|within|cheaper than)\s*\$?(\d+)/);
  const cat = Object.keys(CAT_RE).find(c => CAT_RE[c].test(s));
  const work = /work|office|desk/.test(s);
  let list = PRODUCTS;
  if (work) list = list.filter(p => [4, 5, 6].includes(p.id));
  else if (cat) list = list.filter(p => p.cat === cat);
  if (under) list = list.filter(p => p.price <= +under[1]);
  if (cat || under || work || /show|all|product|catalog|browse|sell|recommend|gift/.test(s))
    return list.length ? { t: 'I found a few great picks for you.', items: list } : { t: 'Nothing matched that filter.' };
  const hit = find(s);
  if (hit) return { t: `${hit.name}: ${hit.d} ${f(hit.price)}.`, items: [hit] };
  return { t: 'I can help you browse, filter by price or category, add to cart and check out. What are you looking for?' };
}