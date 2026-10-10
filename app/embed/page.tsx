import ChatWidget from '@/components/ChatWidget';

// Rendered inside the iframe that public/embed.js injects into third-party sites.
export default function Embed() {
  return (
    <>
      <style>{`html,body{background:transparent!important;overflow:hidden}`}</style>
      <ChatWidget embedded />
    </>
  );
}