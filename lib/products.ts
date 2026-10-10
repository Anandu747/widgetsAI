export type Product = { id: number; name: string; price: number; cat: string; icon: string; d: string; img: string; tag: string };
export const CATS = ['all', 'audio', 'wearables', 'accessories', 'home'];

// Paste the Unsplash image address between the quotes. Size/quality params are added automatically.
// Leave '' to show an icon instead.
const IMG = {
  earbuds: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1289&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  smartwatch: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  speaker: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  powerbank: 'https://images.unsplash.com/photo-1594843665794-446ce915d840?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  lamp: 'https://plus.unsplash.com/premium_photo-1681412205156-bb506a4ea970?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  backpack: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  fitband: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=888&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  mug: 'https://plus.unsplash.com/premium_photo-1719017276454-99ae8306c200?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
};

const img = (url: string) => (url ? url.split('?')[0] + '?auto=format&fit=crop&w=600&q=80' : '');

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Aero Earbuds', price: 79, cat: 'audio', icon: 'headphones', d: 'Noise cancelling, 30h battery', img: img(IMG.earbuds), tag: 'AUDIO' },
  { id: 2, name: 'Pulse Smartwatch', price: 129, cat: 'wearables', icon: 'watch', d: 'Heart rate, GPS, 7-day battery', img: img(IMG.smartwatch), tag: 'WEARABLES' },
  { id: 3, name: 'Nimbus Speaker', price: 59, cat: 'audio', icon: 'speaker', d: 'Portable waterproof Bluetooth speaker', img: img(IMG.speaker), tag: 'AUDIO' },
  { id: 4, name: 'Volt Power Bank', price: 35, cat: 'accessories', icon: 'battery', d: '20,000mAh fast charging with multiple ports.', img: img(IMG.powerbank), tag: 'TECH ESSENTIALS' },
  { id: 5, name: 'Glow Desk Lamp', price: 42, cat: 'home', icon: 'bulb', d: 'Dimmable LED with wireless charger.', img: img(IMG.lamp), tag: 'HOME & LIFESTYLE' },
  { id: 6, name: 'Trek Backpack', price: 65, cat: 'accessories', icon: 'backpack', d: 'Water resistant, laptop sleeve', img: img(IMG.backpack), tag: 'TRAVEL' },
  { id: 7, name: 'Fit Band', price: 39, cat: 'wearables', icon: 'activity', d: 'Step and sleep tracking', img: img(IMG.fitband), tag: 'WEARABLES' },
  { id: 8, name: 'Brew Smart Mug', price: 49, cat: 'home', icon: 'coffee', d: 'Keeps drinks at your temperature', img: img(IMG.mug), tag: 'HOME & LIFESTYLE' }
];