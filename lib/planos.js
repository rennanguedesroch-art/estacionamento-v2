// Planos e preços reais do Valent Estacionamentos
export const PLANOS = {
  carro: [
    { id: 'carro-1h', label: '1 hora', horas: 1, valor: 10 },
    { id: 'carro-4h', label: 'Período 4 horas', horas: 4, valor: 18 },
    { id: 'carro-12h', label: 'Período 12 horas', horas: 12, valor: 28 },
  ],
  moto: [
    { id: 'moto-12h', label: 'Diária (12h)', horas: 12, valor: 15 },
  ],
};

// Capacidade estimada por tipo de veículo (ajuste conforme a realidade do pátio)
export const CAPACIDADE = {
  carro: 30,
  moto: 6,
};
