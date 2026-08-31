import type { AnalyticsChartProps } from "@/types";

export function AnalyticsChart({ data, onSeeAll }: AnalyticsChartProps) {
  return (
    <div className="lg:col-span-7 bg-white border border-[#eee7dc] rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-[#f4eee6]">
        <div>
          <h2 className="text-sm sm:text-base font-serif font-bold text-[#191c1d]">
            Sales &amp; Cashflow Telemetry
          </h2>
          <span className="text-[11px] text-[#747878] block mt-0.5">
            Volume trends and client transaction flow
          </span>
        </div>
        {onSeeAll && (
          <button
            type="button"
            onClick={onSeeAll}
            className="text-xs font-semibold text-[#855e2e] hover:underline cursor-pointer"
          >
            See all
          </button>
        )}
      </div>

      {/* SVG Smooth Curve Area Chart */}
      <div className="relative w-full overflow-x-auto pt-4 pb-1">
        <div className="min-w-[480px]">
          <svg viewBox="0 0 840 260" className="w-full h-56 overflow-visible">
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#855e2e" stopOpacity="0.18" />
                <stop offset="70%" stopColor="#855e2e" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Dotted Grid Lines */}
            {[40, 80, 120, 160, 200, 240].map((y, idx) => (
              <g key={y}>
                <text
                  x="0"
                  y={y + 4}
                  fill="#a19d97"
                  fontSize="10"
                  fontFamily="sans-serif"
                  fontWeight="500"
                >
                  {data.chart.yLabels[idx]}
                </text>
                <line
                  x1="35"
                  y1={y}
                  x2="800"
                  y2={y}
                  stroke="#f0ebe3"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
              </g>
            ))}

            {/* Filled Area Gradient */}
            <path d={data.chart.areaPath} fill="url(#curveGradient)" />

            {/* Main Stroke Curve */}
            <path
              d={data.chart.linePath}
              fill="none"
              stroke="#855e2e"
              strokeWidth="2.25"
              strokeLinecap="round"
            />

            {/* Peak Indicator Callout */}
            <g>
              <circle
                cx={data.chart.peakCoord.cx}
                cy={data.chart.peakCoord.cy}
                r="4.5"
                fill="#855e2e"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <rect
                x={data.chart.peakCoord.cx - 22}
                y={data.chart.peakCoord.cy - 30}
                width="44"
                height="20"
                rx="5"
                fill="#191c1d"
              />
              <text
                x={data.chart.peakCoord.cx}
                y={data.chart.peakCoord.cy - 16}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontWeight="600"
                fontFamily="sans-serif"
              >
                {data.chart.peakValue}
              </text>
            </g>
          </svg>

          {/* X-Axis Labels */}
          <div className="flex justify-between pl-9 pr-4 pt-2 text-[10px] font-medium text-[#a19d97]">
            {data.chart.xLabels.map(lbl => (
              <span key={lbl}>{lbl}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
