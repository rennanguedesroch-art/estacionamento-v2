import { Archivo_Black, Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import FloatingWhatsapp from '@/components/FloatingWhatsapp';

const display = Archivo_Black({ subsets: ['latin'], weight: '400', variable: '--font-display' });
const body = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-body' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-mono' });

export const metadata = {
  title: 'Valent Estacionamentos | Vila Prudente, São Paulo',
  description:
    'Estacionamento avulso, mensalistas, pernoite com câmeras e lava-rápido profissional na Vila Prudente, São Paulo. R. Cavour, 329.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${body.variable} ${mono.variable} font-body bg-asphalt text-chalk`}>
        {children}
        <FloatingWhatsapp />
      </body>
    </html>
  );
}
