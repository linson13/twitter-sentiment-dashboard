import { useState } from 'react';

interface Props {
  labels: string[];
  matrix: number[][];
}

const CLASS_COLOR: Record<string, string> = {
  positive: '#0f9d78',
  negative: '#d6455a',
  neutral: '#7d8ba1',
};

export default function ConfusionMatrixHeatmap({ labels, matrix }: Props) {
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null);

  const total = matrix.flat().reduce((a, b) => a + b, 0);
  const max = Math.max(...matrix.flat());
  const cell = 108;
  const gap = 4;
  const labelSpace = 92;
  const size = labels.length * (cell + gap) - gap;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${size + labelSpace + 20} ${size + labelSpace + 20}`}
        className="w-full max-w-xl mx-auto"
        role="img"
        aria-label="Confusion matrix of predicted vs true sentiment labels"
      >
        {/* Column labels (Predicted) */}
        {labels.map((label, c) => (
          <text
            key={`col-${label}`}
            x={labelSpace + c * (cell + gap) + cell / 2}
            y={labelSpace - 14}
            textAnchor="middle"
            className="font-data fill-ink-soft"
            fontSize="12"
          >
            {label}
          </text>
        ))}
        <text
          x={labelSpace + size / 2}
          y={20}
          textAnchor="middle"
          className="font-display fill-ink"
          fontSize="13"
          fontWeight="600"
        >
          Predicted label
        </text>

        {/* Row labels (True) */}
        {labels.map((label, r) => (
          <text
            key={`row-${label}`}
            x={labelSpace - 14}
            y={labelSpace + r * (cell + gap) + cell / 2 + 4}
            textAnchor="end"
            className="font-data fill-ink-soft"
            fontSize="12"
          >
            {label}
          </text>
        ))}
        <text
          x={16}
          y={labelSpace + size / 2}
          textAnchor="middle"
          className="font-display fill-ink"
          fontSize="13"
          fontWeight="600"
          transform={`rotate(-90, 16, ${labelSpace + size / 2})`}
        >
          True label
        </text>

        {/* Cells */}
        {matrix.map((row, r) =>
          row.map((value, c) => {
            const isDiagonal = r === c;
            const intensity = max > 0 ? value / max : 0;
            const baseColor = isDiagonal ? CLASS_COLOR[labels[r]] : '#d6455a';
            const isHovered = hovered?.row === r && hovered?.col === c;
            const x = labelSpace + c * (cell + gap);
            const y = labelSpace + r * (cell + gap);

            return (
              <g
                key={`${r}-${c}`}
                onMouseEnter={() => setHovered({ row: r, col: c })}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={x}
                  y={y}
                  width={cell}
                  height={cell}
                  rx={6}
                  fill={baseColor}
                  opacity={isDiagonal ? 0.18 + intensity * 0.75 : 0.06 + intensity * 0.4}
                  stroke={isHovered ? baseColor : 'transparent'}
                  strokeWidth={2}
                />
                <text
                  x={x + cell / 2}
                  y={y + cell / 2 - 6}
                  textAnchor="middle"
                  className="font-data fill-ink"
                  fontSize="20"
                  fontWeight="600"
                >
                  {value.toLocaleString()}
                </text>
                <text
                  x={x + cell / 2}
                  y={y + cell / 2 + 16}
                  textAnchor="middle"
                  className="font-data fill-ink-soft"
                  fontSize="11"
                >
                  {total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'}%
                </text>
              </g>
            );
          }),
        )}
      </svg>

      <div className="text-center mt-2 min-h-[1.5rem]">
        {hovered && (
          <p className="font-data text-xs text-ink-soft">
            True <span className="font-semibold text-ink">{labels[hovered.row]}</span>, predicted{' '}
            <span className="font-semibold text-ink">{labels[hovered.col]}</span> —{' '}
            {matrix[hovered.row][hovered.col].toLocaleString()} tweets
          </p>
        )}
      </div>
    </div>
  );
}
