import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CalendarDays } from 'lucide-react';
import { api } from '../api/apiService';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DAY_TYPE = {
  SCHOOL: 'school-day',
  SPECIAL: 'special-school-day',
  HOLIDAY: 'holiday',
};

function toDate(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'number') {
    return null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (/^\d{1,2}$/.test(trimmed)) {
    return null;
  }

  const direct = new Date(trimmed);
  if (!Number.isNaN(direct.getTime())) {
    return direct;
  }

  const match = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toDateKey(input) {
  const date = toDate(input);
  if (!date) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function prettyDate(input) {
  const date = toDate(input);
  if (!date) return 'Unknown date';

  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function getTypeLabel(type) {
  if (type === DAY_TYPE.HOLIDAY) return 'Holiday';
  if (type === DAY_TYPE.SPECIAL) return 'Special school day';
  return 'School day';
}

function buildCalendarCells(monthDate) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();

  const cells = [];

  for (let i = 0; i < startDayOfWeek; i += 1) {
    cells.push({ type: 'blank', key: `b-${i}` });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const current = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
    cells.push({
      type: 'day',
      key: toDateKey(current),
      day,
    });
  }

  return cells;
}

function getDayNumber(item) {
  const candidates = [
    item?.day,
    item?.school_day,
    item?.date_number,
    item?.day_of_month,
    item?.date,
  ];

  for (const raw of candidates) {
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 31) {
      return parsed;
    }
  }

  return null;
}

function getMonthNumber(item) {
  const candidates = [item?.month, item?.month_number, item?.school_month];

  for (const raw of candidates) {
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 12) {
      return parsed;
    }
  }

  const monthName = String(item?.month_name || item?.month_label || '').trim().toLowerCase();
  if (!monthName) {
    return null;
  }

  const matchIndex = MONTHS.findIndex((month) => month.toLowerCase().startsWith(monthName.slice(0, 3)));
  return matchIndex >= 0 ? matchIndex + 1 : null;
}

function classifyDay(item) {
  const raw = String(
    item?.type ||
      item?.day_type ||
      item?.category ||
      item?.status ||
      item?.calendar_type ||
      item?.event_type ||
      item?.kind ||
      item?.classification ||
      '',
  ).toLowerCase();

  const code = String(item?.code || item?.day_code || item?.type_code || '').toLowerCase();
  const descriptor = String(
    item?.name ||
      item?.label ||
      item?.description ||
      item?.notes ||
      item?.event_name ||
      item?.title ||
      '',
  ).toLowerCase();

  const combined = `${raw} ${descriptor}`;

  if (
    combined.includes('holiday') ||
    combined.includes('no class') ||
    combined.includes('walang pasok')
  ) {
    return DAY_TYPE.HOLIDAY;
  }

  if (code === 'h' || code === 'hol' || code === 'holiday') {
    return DAY_TYPE.HOLIDAY;
  }

  if (
    combined.includes('special') ||
    combined.includes('special academic event') ||
    combined.includes('academic event') ||
    combined.includes('event day')
  ) {
    return DAY_TYPE.SPECIAL;
  }

  if (
    code === 's' ||
    code === 'sp' ||
    code === 'spec' ||
    code === 'special' ||
    code === 'ssd' ||
    code === 'special_school_day'
  ) {
    return DAY_TYPE.SPECIAL;
  }

  if (raw.includes('school')) {
    return DAY_TYPE.SCHOOL;
  }

  if (item?.is_holiday === true || Number(item?.is_holiday) === 1) {
    return DAY_TYPE.HOLIDAY;
  }

  if (
    item?.is_special === true ||
    item?.is_special_day === true ||
    item?.is_special_school_day === true ||
    item?.is_special_schoolday === true ||
    item?.special_day === true ||
    item?.is_special_event === true ||
    item?.is_special_academic_event === true ||
    item?.is_academic_event === true ||
    Number(item?.is_special) === 1 ||
    Number(item?.is_special_day) === 1 ||
    Number(item?.is_special_school_day) === 1 ||
    Number(item?.is_special_schoolday) === 1 ||
    Number(item?.special_day) === 1 ||
    Number(item?.is_special_event) === 1 ||
    Number(item?.is_special_academic_event) === 1 ||
    Number(item?.is_academic_event) === 1
  ) {
    return DAY_TYPE.SPECIAL;
  }

  if (item?.is_school_day === true || Number(item?.is_school_day) === 1) {
    return DAY_TYPE.SCHOOL;
  }

  return DAY_TYPE.SCHOOL;
}

function getDateKeyFromItem(item, schoolYear) {
  const dateCandidates = [
    item?.date,
    item?.school_date,
    item?.day_date,
    item?.holiday_date,
    item?.special_date,
    item?.calendar_date,
  ];

  for (const candidate of dateCandidates) {
    const key = toDateKey(candidate);
    if (key) {
      return key;
    }
  }

  const dayNumber = getDayNumber(item);
  const monthNumber = getMonthNumber(item);

  if (!dayNumber || !monthNumber) {
    return null;
  }

  const year = monthNumber >= 6 ? schoolYear.startYear : schoolYear.endYear;
  const inferred = new Date(year, monthNumber - 1, dayNumber);
  return toDateKey(inferred);
}

function getTypeStyle(type) {
  if (type === DAY_TYPE.HOLIDAY) {
    return 'border-red-200 bg-red-50 text-red-700';
  }

  if (type === DAY_TYPE.SPECIAL) {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }

  return 'border-sky-200 bg-sky-50 text-sky-700';
}

function getSchoolYearWindow(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const startYear = month >= 6 ? year : year - 1;
  const endYear = startYear + 1;

  return {
    startYear,
    endYear,
    label: `${startYear}-${endYear}`,
  };
}

export default function SchoolCalendar() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [anchorDate, setAnchorDate] = useState(new Date());
  const [schoolDays, setSchoolDays] = useState([]);
  const schoolYear = useMemo(() => getSchoolYearWindow(anchorDate), [anchorDate]);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.getSchoolDays({
          all: true,
          perPageAll: true,
          schoolYear: schoolYear.label,
          schoolYearStart: schoolYear.startYear,
          schoolYearEnd: schoolYear.endYear,
        });

        if (!mounted) return;
        setSchoolDays(response?.data ?? []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || 'Failed to load school calendar data.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [schoolYear]);

  const todayKey = toDateKey(new Date());

  const schoolYearMonths = useMemo(() => {
    const months = [];

    for (let month = 6; month <= 12; month += 1) {
      months.push(new Date(schoolYear.startYear, month - 1, 1));
    }

    for (let month = 1; month <= 5; month += 1) {
      months.push(new Date(schoolYear.endYear, month - 1, 1));
    }

    return months;
  }, [schoolYear]);

  const dayTypeMap = useMemo(() => {
    const map = new Map();

    schoolDays.forEach((item) => {
      const key = getDateKeyFromItem(item, schoolYear);

      if (!key) {
        return;
      }

      const type = classifyDay(item);
      const label = item?.label || item?.name || item?.description || '';

      // Priority order ensures holiday beats special and special beats school day.
      const priority = {
        [DAY_TYPE.SCHOOL]: 1,
        [DAY_TYPE.SPECIAL]: 2,
        [DAY_TYPE.HOLIDAY]: 3,
      };

      const existing = map.get(key);
      if (!existing || priority[type] > priority[existing.type]) {
        map.set(key, { type, label });
      }
    });

    return map;
  }, [schoolDays, schoolYear]);

  const listedDays = useMemo(() => {
    const rows = [];

    dayTypeMap.forEach((value, key) => {
      rows.push({
        key,
        type: value.type,
        label: value.label,
      });
    });

    rows.sort((a, b) => a.key.localeCompare(b.key));

    return rows.filter((row) => {
      const date = toDate(row.key);
      return (
        date &&
        ((date.getFullYear() === schoolYear.startYear && date.getMonth() >= 5) ||
          (date.getFullYear() === schoolYear.endYear && date.getMonth() <= 4))
      );
    });
  }, [dayTypeMap, schoolYear]);

  const typeCounts = useMemo(() => {
    const counts = {
      [DAY_TYPE.SCHOOL]: 0,
      [DAY_TYPE.SPECIAL]: 0,
      [DAY_TYPE.HOLIDAY]: 0,
    };

    listedDays.forEach((item) => {
      counts[item.type] += 1;
    });

    return counts;
  }, [listedDays]);

  const goPrevYear = () => {
    setAnchorDate((current) => new Date(current.getFullYear() - 1, current.getMonth(), 1));
  };

  const goNextYear = () => {
    setAnchorDate((current) => new Date(current.getFullYear() + 1, current.getMonth(), 1));
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-800">School Calendar</h1>
        <p className="text-sm text-slate-500">
          Blue: school days, Green: special school days, Red: holidays
        </p>
        <p className="text-xs text-slate-400">School Year {schoolYear.label}</p>
        <p className="text-xs text-slate-400">
          School days: {typeCounts[DAY_TYPE.SCHOOL]} | Special school days: {typeCounts[DAY_TYPE.SPECIAL]} | Holidays: {typeCounts[DAY_TYPE.HOLIDAY]}
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              onClick={goPrevYear}
            >
              Prev Year
            </button>
            <div className="text-center">
              <p className="text-sm text-slate-500">School Year Overview</p>
              <h2 className="text-lg font-semibold text-slate-800">{schoolYear.label}</h2>
            </div>
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              onClick={goNextYear}
            >
              Next Year
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {schoolYearMonths.map((monthDate) => {
              const monthCells = buildCalendarCells(monthDate);
              const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;

              return (
                <div key={monthKey} className="rounded-xl border border-slate-100 p-3">
                  <h3 className="mb-2 text-sm font-semibold text-slate-700">
                    {MONTHS[monthDate.getMonth()]} {monthDate.getFullYear()}
                  </h3>

                  <div className="mb-1 grid grid-cols-7 gap-1 text-center">
                    {DAY_LABELS.map((day) => (
                      <div key={`${monthKey}-${day}`} className="py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {monthCells.map((cell) => {
                      if (cell.type === 'blank') {
                        return <div key={`${monthKey}-${cell.key}`} className="h-8 rounded-md bg-transparent" />;
                      }

                      const info = dayTypeMap.get(cell.key);
                      const isToday = todayKey === cell.key;
                      const style = info
                        ? getTypeStyle(info.type)
                        : 'border-slate-100 bg-white text-slate-700';

                      const title = info
                        ? `${cell.key} • ${getTypeLabel(info.type)}${info.label ? ` • ${info.label}` : ''}`
                        : cell.key;

                      return (
                        <div
                          key={`${monthKey}-${cell.key}`}
                          className={`h-8 rounded-md border px-1.5 py-1 text-xs font-medium ${style} ${isToday ? 'ring-2 ring-red-300' : ''}`}
                          title={title}
                        >
                          {cell.day}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-sky-300" />School day</span>
            <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-emerald-300" />Special school day</span>
            <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-red-300" />Holiday</span>
          </div>
        </div>

        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-3 flex items-center gap-2 text-slate-700">
            <CalendarDays size={17} />
            <h2 className="text-base font-semibold">School Day List</h2>
          </div>

          <div className="max-h-[28rem] overflow-y-auto">
            {loading ? (
              <p className="px-4 py-6 text-sm text-slate-500">Loading school calendar data...</p>
            ) : listedDays.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-500">No school calendar entries found.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {listedDays.map((item) => (
                  <li key={`${item.key}-${item.type}`} className="px-4 py-3 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-800">{prettyDate(item.key)}</p>
                        {item.label && <p className="mt-0.5 text-xs text-slate-500">{item.label}</p>}
                      </div>
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${getTypeStyle(item.type)}`}>
                        {getTypeLabel(item.type)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
