'use client';

import { useState } from 'react';
import { IconChevron } from './icons';

const PERGUNTAS = [
  {
    p: 'Preciso reservar uma vaga?',
    r: 'Não é obrigatório — o estacionamento avulso funciona por ordem de chegada, dentro do horário de funcionamento. Mas você também pode reservar pelo site com antecedência, para garantir sua vaga no horário desejado.',
  },
  {
    p: 'O estacionamento funciona durante a noite?',
    r: 'O atendimento de balcão funciona até às 23h de segunda a sexta e até às 16h aos sábados. Para quem precisa deixar o veículo durante a madrugada, oferecemos o serviço de pernoite com câmeras de segurança.',
  },
  {
    p: 'Existem planos para mensalistas?',
    r: 'Sim. O plano mensal garante sua vaga fixa nos dias de funcionamento. Fale com a gente pelo WhatsApp para consultar valores e disponibilidade.',
  },
  {
    p: 'O lava-rápido precisa ser agendado?',
    r: 'Normalmente atendemos por ordem de chegada. Para garantir horário, recomendamos confirmar disponibilidade pelo WhatsApp antes de ir.',
  },
  {
    p: 'Quais formas de pagamento são aceitas?',
    r: 'Aceitamos dinheiro, Pix, cartão de débito, cartão de crédito e tag Sem Parar.',
  },
];

export default function FAQ() {
  const [aberto, setAberto] = useState(0);

  return (
    <div className="divide-y divide-asphalt-line border-t border-b border-asphalt-line">
      {PERGUNTAS.map((item, i) => {
        const ativo = aberto === i;
        return (
          <div key={item.p}>
            <button
              onClick={() => setAberto(ativo ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 py-5 text-left"
              aria-expanded={ativo}
            >
              <span className="text-chalk font-medium">{item.p}</span>
              <IconChevron
                className={`w-5 h-5 shrink-0 text-signal transition-transform duration-300 ${
                  ativo ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: ativo ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="pb-5 text-chalk/60 text-sm leading-relaxed max-w-xl">{item.r}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
