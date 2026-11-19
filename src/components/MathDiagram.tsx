import type { MathDiagramType } from '../types/game';

export function MathDiagram({ type }: { type: MathDiagramType }) {
  if (type === 'parallel-angles') {
    return (
      <div className="my-3 rounded-xl border border-slate-700/80 bg-slate-950/70 p-3 flex flex-col items-center">
        <svg
          viewBox="0 0 320 150"
          className="w-full max-w-[300px] h-auto"
          role="img"
          aria-label="رسم توضيحي لمستقيمين متوازيين أ و ب يقطعهما قاطع بزاوية 50 درجة وزاوية س"
        >
          {/* Parallel line أ */}
          <line x1="30" y1="45" x2="290" y2="45" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          <text x="298" y="49" fill="#38bdf8" fontSize="15" fontWeight="bold" textAnchor="start">
            أ
          </text>

          {/* Parallel line ب */}
          <line x1="30" y1="105" x2="290" y2="105" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          <text x="298" y="109" fill="#38bdf8" fontSize="15" fontWeight="bold" textAnchor="start">
            ب
          </text>

          {/* Parallel arrows */}
          <polyline points="75,40 83,45 75,50" fill="none" stroke="#38bdf8" strokeWidth="2" />
          <polyline points="75,100 83,105 75,110" fill="none" stroke="#38bdf8" strokeWidth="2" />

          {/* Transversal */}
          <line x1="115" y1="15" x2="205" y2="135" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />

          {/* 50 degree arc at top intersection (137.5, 45) */}
          <path d="M 157 45 A 20 20 0 0 1 149 61" fill="none" stroke="#34d399" strokeWidth="2.5" />
          <text x="166" y="64" fill="#34d399" fontSize="14" fontWeight="bold">
            ٥٠°
          </text>

          {/* Angle س arc at bottom intersection (182.5, 105) */}
          <path d="M 162 105 A 20 20 0 0 1 171 89" fill="none" stroke="#f472b6" strokeWidth="2.5" />
          <text x="150" y="96" fill="#f472b6" fontSize="15" fontWeight="bold">
            س
          </text>
        </svg>
        <span className="text-xs text-slate-400 mt-1">مستقيمان متوازيان يقطعهما قاطع (أ ∥ ب)</span>
      </div>
    );
  }

  // number-line
  return (
    <div className="my-3 rounded-xl border border-slate-700/80 bg-slate-950/70 p-3 flex flex-col items-center">
      <svg
        viewBox="0 0 340 90"
        className="w-full max-w-[320px] h-auto"
        role="img"
        aria-label="خط الأعداد من 0 إلى 2 وتقع النقطة أ في المنتصف عند 1.5"
      >
        {/* Main line */}
        <line x1="25" y1="52" x2="315" y2="52" stroke="#94a3b8" strokeWidth="2.5" />
        {/* End arrows */}
        <polyline points="32,47 23,52 32,57" fill="none" stroke="#94a3b8" strokeWidth="2" />
        <polyline points="308,47 317,52 308,57" fill="none" stroke="#94a3b8" strokeWidth="2" />

        {/* Ticks at 0, 0.5, 1, 1.5, 2 */}
        {[
          { x: 60, label: '٠', major: true },
          { x: 115, label: '٠٫٥', major: false },
          { x: 170, label: '١', major: true },
          { x: 225, label: '', major: false },
          { x: 280, label: '٢', major: true },
        ].map((tick) => (
          <g key={tick.x}>
            <line
              x1={tick.x}
              y1={tick.major ? 42 : 46}
              x2={tick.x}
              y2={tick.major ? 62 : 58}
              stroke={tick.major ? '#e2e8f0' : '#64748b'}
              strokeWidth={tick.major ? 2.5 : 1.5}
            />
            {tick.label && (
              <text x={tick.x} y="78" fill="#cbd5e1" fontSize="13" fontWeight="bold" textAnchor="middle">
                {tick.label}
              </text>
            )}
          </g>
        ))}

        {/* Point أ at 1.5 (x = 225) */}
        <circle cx="225" cy="52" r="6" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" />
        <text x="225" y="30" fill="#fbbf24" fontSize="15" fontWeight="bold" textAnchor="middle">
          النقطة أ
        </text>
      </svg>
    </div>
  );
}
