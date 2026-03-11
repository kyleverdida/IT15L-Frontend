import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-md text-sm">
      <p className="font-semibold text-slate-800">{name}</p>
      <p className="text-slate-500">{value} students enrolled</p>
    </div>
  );
}

function CourseLegend({ data }) {
  return (
    <ul className="space-y-1.5 text-xs text-slate-600">
      {data.map((entry) => (
        <li key={entry.name} className="flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: entry.fill }}
          />
          <span className="truncate">{entry.name}</span>
          <span className="ml-auto font-medium text-slate-800 shrink-0">
            {entry.value}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function CourseDistributionChart({ data }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-1 text-base font-semibold text-slate-900">Course Distribution</h3>
      <p className="mb-4 text-sm text-slate-500">Student enrollment count per degree program.</p>
      <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
        <div className="h-52 md:h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={42}
                outerRadius={82}
                paddingAngle={2}
                cx="50%"
                cy="50%"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/50 p-3">
          <CourseLegend data={data} />
        </div>
      </div>
    </div>
  );
}
