import { IconWhatsapp } from './icons';

export default function FloatingWhatsapp() {
  return (
    <a
      href="https://wa.me/5511991767870"
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="md:hidden fixed bottom-5 right-5 z-50 bg-signal text-asphalt w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-black/40 active:scale-95 transition-transform"
    >
      <IconWhatsapp className="w-7 h-7" />
    </a>
  );
}
