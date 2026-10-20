export default function ParkingScene() {
  return (
    <div>
      <svg viewBox="0 0 500 250" className="w-full h-auto">
        <rect x="0" y="42" width="500" height="26" fill="#141416" />
        <line x1="0" y1="55" x2="500" y2="55" stroke="#2A2A2E" strokeWidth="1" strokeDasharray="10 8" />

        <line x1="130" y1="90" x2="130" y2="230" stroke="#F5B301" strokeWidth="1.5" strokeDasharray="6 6" opacity=".45" />
        <line x1="230" y1="90" x2="230" y2="230" stroke="#F5B301" strokeWidth="1.5" strokeDasharray="6 6" opacity=".45" />
        <line x1="330" y1="90" x2="330" y2="230" stroke="#F5B301" strokeWidth="1.5" strokeDasharray="6 6" opacity=".45" />
        <line x1="430" y1="90" x2="430" y2="230" stroke="#F5B301" strokeWidth="1.5" strokeDasharray="6 6" opacity=".45" />
        <line x1="40" y1="230" x2="490" y2="230" stroke="#2A2A2E" strokeWidth="1.5" />

        <rect x="240" y="90" width="90" height="140" rx="8" fill="none" stroke="#F5B301" strokeWidth="1.5" strokeDasharray="8 6" opacity=".6" />
        <text x="285" y="106" textAnchor="middle" className="mono tag-vaga" fontSize="9" letterSpacing="1.5" fill="#F5B301">LIVRE</text>

        <rect x="438" y="120" width="50" height="90" rx="8" fill="none" stroke="#F5B301" strokeWidth="1.5" strokeDasharray="8 6" opacity=".6" />
        <text x="463" y="136" textAnchor="middle" className="mono tag-moto" fontSize="8" letterSpacing="1" fill="#F5B301">MOTO</text>

        {[
          { x: 85, fill: '#2E2F34' },
          { x: 185, fill: '#35363B' },
          { x: 385, fill: '#2E2F34' },
        ].map((c) => (
          <g key={c.x} transform={`translate(${c.x},160)`}>
            <rect x="-25" y="-50" width="50" height="100" rx="12" fill={c.fill} />
            <rect x="-18" y="-30" width="36" height="26" rx="4" fill="#141416" opacity=".6" />
            <circle cx="-25" cy="-30" r="3" fill="#141416" />
            <circle cx="25" cy="-30" r="3" fill="#141416" />
            <circle cx="-25" cy="30" r="3" fill="#141416" />
            <circle cx="25" cy="30" r="3" fill="#141416" />
          </g>
        ))}

        <rect x="22" y="38" width="8" height="34" rx="2" fill="#1E1E22" stroke="#3A3A40" />
        <g className="gate-arm">
          <rect x="30" y="52" width="54" height="6" rx="3" fill="#F4F2ED" />
          <rect x="38" y="52" width="8" height="6" fill="#0B0B0D" />
          <rect x="54" y="52" width="8" height="6" fill="#0B0B0D" />
          <rect x="70" y="52" width="8" height="6" fill="#0B0B0D" />
        </g>

        <g className="car-anim">
          <path
            d="M -24,-8 Q -24,-11 -21,-11 L 13,-11 Q 21,-11 23,-6 Q 24.5,0 23,6 Q 21,11 13,11 L -21,11 Q -24,11 -24,8 Z"
            fill="#F5B301"
          />
          <rect x="-15" y="-13" width="7" height="4" rx="1.5" fill="#141416" />
          <rect x="6" y="-13" width="7" height="4" rx="1.5" fill="#141416" />
          <rect x="-15" y="9" width="7" height="4" rx="1.5" fill="#141416" />
          <rect x="6" y="9" width="7" height="4" rx="1.5" fill="#141416" />
          <rect x="-4" y="-7" width="17" height="14" rx="4" fill="#141416" opacity=".5" />
          <circle cx="15" cy="-9" r="1.4" fill="#141416" />
          <circle cx="15" cy="9" r="1.4" fill="#141416" />
        </g>

        <g className="moto-anim">
          <rect x="-16" y="-5" width="32" height="10" rx="5" fill="#F4F2ED" />
          <circle cx="-10" cy="0" r="3.6" fill="#0B0B0D" />
          <circle cx="10" cy="0" r="3.6" fill="#0B0B0D" />
          <rect x="11" y="-7" width="2.4" height="14" rx="1.2" fill="#F4F2ED" />
          <rect x="-19" y="-2" width="5" height="4" rx="1.5" fill="#F4F2ED" />
        </g>
      </svg>
      <p className="font-mono text-xs text-chalk/40 text-center mt-2">
        Entrada e saída ilustradas — reserve de verdade abaixo
      </p>
    </div>
  );
}
