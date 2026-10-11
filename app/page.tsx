import ChatWidget from '@/components/ChatWidget';
import Icon from '@/components/Icons';
import { PRODUCTS } from '@/lib/products';

const FEATURES = [
  { icon: 'mic', t: 'Voice-powered discovery', d: 'Speak naturally to find what you need.' },
  { icon: 'sparkles', t: 'Smart product recommendations', d: 'Get personalized picks based on your interests.' },
  { icon: 'cart', t: 'Seamless checkout', d: 'Add items to cart and check out quickly.' },
];
const FEATURED = [4, 5, 1].map(id => PRODUCTS.find(p => p.id === id)!);

export default function Home() {
  return (
    <main className="land">
      <h1>ShopBot<br /><span className="grad">AI Shopping Assistant</span></h1>
      <p className="lead">A smarter way to discover products, build your cart, and check out.</p>
      <p className="sub">Chat, search, or use voice to find the best products, get personalized recommendations, and add them to your cart — all in one place.</p>
      <div className="feats">
        {FEATURES.map(x => (
          <div className="feat" key={x.t}>
            <div className="fic"><Icon name={x.icon} size={22} /></div>
            <div><b>{x.t}</b><span>{x.d}</span></div>
          </div>
        ))}
      </div>
      <div className="fgrid">
        {FEATURED.map(p => (
          <div className="fcard" key={p.id}>
            <div className="fimg" style={{ backgroundImage: `${p.img ? `url(${p.img}), ` : ''}linear-gradient(135deg,#312e81,#1e1b4b)` }}>
              <span className="ftag">{p.tag}</span>
            </div>
            <div className="fbody">
              <div><b>{p.name}</b><span>{p.d}</span><em>${p.price.toFixed(2)}</em></div>
              <i className="farrow"><Icon name="chevron" size={18} /></i>
            </div>
          </div>
        ))}
      </div>
      <ChatWidget />
    </main>
  );
}