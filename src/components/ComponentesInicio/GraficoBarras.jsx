import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DicaDoGrafico from "./DicaDoGrafico";

const ALTURA_POR_BARRA = 56;
const LIMITE_DO_ROTULO = 42;
const COR_DA_BARRA = "var(--color-red-500)";
const COR_DO_TEXTO = "var(--color-gray-300)";

function encurtar(texto, limite) {
  if (texto.length <= limite) return texto;
  return `${texto.slice(0, limite - 1).trimEnd()}…`;
}

function textoDoRotulo(rotulo, detalhe) {
  if (!detalhe) return encurtar(rotulo, LIMITE_DO_ROTULO);

  const complemento = ` · ${detalhe}`;
  return `${encurtar(rotulo, LIMITE_DO_ROTULO - complemento.length)}${complemento}`;
}

function GraficoBarras({ dados, sufixo = "", maximo, detalheNoRotulo = false }) {
  function rotuloAcimaDaBarra({ x, y, value, index }) {
    return (
      <text x={x} y={y - 6} fill={COR_DO_TEXTO} fontSize={13}>
        {textoDoRotulo(value, detalheNoRotulo ? dados[index]?.detalhe : null)}
      </text>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={dados.length * ALTURA_POR_BARRA}>
      <BarChart data={dados} layout="vertical" margin={{ top: 0, right: 48, bottom: 0, left: 0 }}>
        <XAxis type="number" hide domain={[0, maximo ?? "dataMax"]} />
        <YAxis type="category" dataKey="rotulo" hide />
        <Tooltip
          cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
          content={<DicaDoGrafico sufixo={sufixo} />}
        />
        <Bar
          dataKey="valor"
          fill={COR_DA_BARRA}
          barSize={18}
          radius={[0, 4, 4, 0]}
          isAnimationActive={false}
        >
          <LabelList dataKey="rotulo" content={rotuloAcimaDaBarra} />
          <LabelList
            dataKey="valor"
            position="right"
            fill={COR_DO_TEXTO}
            fontSize={13}
            formatter={(valor) => `${valor}${sufixo}`}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default GraficoBarras;
