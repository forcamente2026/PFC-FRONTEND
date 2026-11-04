import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DicaDoGrafico from "./DicaDoGrafico";

const ALTURA = 224;
const COR_DA_LINHA_DO_DADO = "var(--color-red-500)";
const COR_DO_TEXTO = "var(--color-gray-300)";
const COR_DA_GRADE = "var(--color-gray-700)";
const COR_DO_FUNDO = "#0e1223";

function GraficoLinha({ dados, sufixo = "", maximo }) {
  const ultimoIndice = dados.length - 1;

  function rotuloDoUltimoPonto({ x, y, value, index }) {
    if (index !== ultimoIndice) return null;

    return (
      <text x={x} y={y - 12} fill={COR_DO_TEXTO} fontSize={13} textAnchor="middle">
        {`${value}${sufixo}`}
      </text>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={ALTURA}>
      <LineChart data={dados} margin={{ top: 24, right: 24, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke={COR_DA_GRADE} />
        <XAxis
          dataKey="rotulo"
          tickLine={false}
          tickMargin={8}
          axisLine={{ stroke: COR_DA_GRADE }}
          tick={{ fill: COR_DO_TEXTO, fontSize: 13 }}
          minTickGap={16}
        />
        <YAxis
          width={44}
          domain={[0, maximo ?? "auto"]}
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tick={{ fill: COR_DO_TEXTO, fontSize: 13 }}
          tickFormatter={(valor) => `${valor}${sufixo}`}
        />
        <Tooltip
          cursor={{ stroke: COR_DA_GRADE }}
          content={<DicaDoGrafico sufixo={sufixo} />}
        />
        <Line
          type="linear"
          dataKey="valor"
          stroke={COR_DA_LINHA_DO_DADO}
          strokeWidth={2}
          dot={{ r: 5, fill: COR_DA_LINHA_DO_DADO, stroke: COR_DO_FUNDO, strokeWidth: 2 }}
          activeDot={{ r: 7, fill: COR_DA_LINHA_DO_DADO, stroke: COR_DO_FUNDO, strokeWidth: 2 }}
          isAnimationActive={false}
        >
          <LabelList dataKey="valor" content={rotuloDoUltimoPonto} />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  );
}

export default GraficoLinha;
