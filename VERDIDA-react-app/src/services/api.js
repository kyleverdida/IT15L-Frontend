const SESSION_KEY = 'session';
const PROGRAM_STATUS_OVERRIDES_KEY = 'program_status_overrides';
const PROGRAM_TYPE_OVERRIDES_KEY = 'program_type_overrides';
const RAW_API_BASE = import.meta.env.VITE_API_URL || '/api';
const API_KEY = import.meta.env.VITE_API_KEY || '';
const API_KEY_HEADER = import.meta.env.VITE_API_KEY_HEADER || 'X-API-Key';
const ROUTES = {
  login: import.meta.env.VITE_API_LOGIN_PATH || '/login',
  me: import.meta.env.VITE_API_ME_PATH || '/me',
  logout: import.meta.env.VITE_API_LOGOUT_PATH || '/logout',
  dashboard: import.meta.env.VITE_API_DASHBOARD_PATH || '/dashboard',
  dashboardMonthlyEnrollment: import.meta.env.VITE_API_DASHBOARD_MONTHLY_ENROLLMENT_PATH || '',
  dashboardCourseDistribution: import.meta.env.VITE_API_DASHBOARD_COURSE_DISTRIBUTION_PATH || '',
  dashboardAttendancePattern: import.meta.env.VITE_API_DASHBOARD_ATTENDANCE_PATTERN_PATH || '',
  students: import.meta.env.VITE_API_STUDENTS_PATH || '/students',
  enrollments: import.meta.env.VITE_API_ENROLLMENTS_PATH || '/enrollments',
  courses: import.meta.env.VITE_API_COURSES_PATH || '/courses',
  schoolDays: import.meta.env.VITE_API_SCHOOL_DAYS_PATH || '/school-days',
  subjects: import.meta.env.VITE_API_SUBJECTS_PATH || '/subjects',
};

const CHART_COLORS = ['#7f1d1d', '#0f766e', '#1d4ed8', '#ca8a04', '#9333ea', '#ea580c'];

function resolveApiBase(base) {
  if (!import.meta.env.PROD) {
    return base;
  }

  if (base.startsWith('/')) {
    return base;
  }

  try {
    const parsed = new URL(base);
    if (parsed.protocol !== 'https:') {
      throw new Error('VITE_API_URL must use HTTPS in production for security compliance.');
    }
    return base.replace(/\/+$/, '');
  } catch {
    throw new Error('VITE_API_URL must be a valid HTTPS URL in production.');
  }
}

const API_BASE = resolveApiBase(RAW_API_BASE);

function getStoredToken() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token ?? null;
  } catch {
    return null;
  }
}

function normalizeResource(payload) {
  if (Array.isArray(payload)) {
    return { data: payload, meta: {} };
  }

  if (payload && Array.isArray(payload.data)) {
    return { data: payload.data, meta: payload.meta ?? {} };
  }

  if (payload && typeof payload === 'object') {
    return { data: payload, meta: payload.meta ?? {} };
  }

  return { data: [], meta: {} };
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const payloadText = typeof payload === 'string' ? payload : '';
    const hasLaravelMissingLoginRoute = payloadText.includes('Route [login] not defined');
    const isAuthFailure =
      hasLaravelMissingLoginRoute ||
      (payload && typeof payload === 'object' && payload.message === 'Unauthenticated.');

    const message = isAuthFailure
      ? 'Unauthorized. Please sign in again.'
      : (payload && typeof payload === 'object' && (payload.message || payload.error)) ||
        `Request failed (${response.status})`;

    const status = response.status === 500 && hasLaravelMissingLoginRoute ? 401 : response.status;

    const error = new Error(message);
    error.status = status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

async function request(path, options = {}) {
  const token = getStoredToken();
  const headers = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(API_KEY ? { [API_KEY_HEADER]: API_KEY } : {}),
    ...(options.headers ?? {}),
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  try {
    return await parseResponse(response);
  } catch (error) {
    if (error.status === 401 && path !== ROUTES.login) {
      localStorage.removeItem(SESSION_KEY);
    }
    throw error;
  }
}

async function requestOrNull(path, options) {
  if (!path) return null;
  try {
    return await request(path, options);
  } catch (error) {
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
}

function getLastPage(payload) {
  const raw = payload?.meta?.last_page ?? payload?.last_page ?? 1;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function getTotalCount(payload, fallbackLength) {
  const raw = payload?.meta?.total ?? payload?.total;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallbackLength;
}

async function requestAllPages(path) {
  const firstPayload = await request(path, { method: 'GET' });
  const firstResource = normalizeResource(firstPayload);
  const collected = Array.isArray(firstResource.data) ? [...firstResource.data] : [];
  const lastPage = getLastPage(firstPayload);

  for (let page = 2; page <= lastPage; page += 1) {
    const separator = path.includes('?') ? '&' : '?';
    const payload = await request(`${path}${separator}page=${page}`, { method: 'GET' });
    const resource = normalizeResource(payload);
    if (Array.isArray(resource.data)) {
      collected.push(...resource.data);
    }
  }

  return {
    data: collected,
    meta: {
      ...(firstResource.meta ?? {}),
      total: getTotalCount(firstPayload, collected.length),
      last_page: lastPage,
    },
  };
}

async function requestAllPagesOrNull(path) {
  const firstPayload = await requestOrNull(path, { method: 'GET' });
  if (!firstPayload) {
    return null;
  }

  const firstResource = normalizeResource(firstPayload);
  const collected = Array.isArray(firstResource.data) ? [...firstResource.data] : [];
  const lastPage = getLastPage(firstPayload);

  for (let page = 2; page <= lastPage; page += 1) {
    const separator = path.includes('?') ? '&' : '?';
    const payload = await request(`${path}${separator}page=${page}`, { method: 'GET' });
    const resource = normalizeResource(payload);
    if (Array.isArray(resource.data)) {
      collected.push(...resource.data);
    }
  }

  return {
    data: collected,
    meta: {
      ...(firstResource.meta ?? {}),
      total: getTotalCount(firstPayload, collected.length),
      last_page: lastPage,
    },
  };
}

let dashboardCache = null;

async function getDashboardPayload() {
  if (dashboardCache) {
    return dashboardCache;
  }
  dashboardCache = await request(ROUTES.dashboard, { method: 'GET' });
  return dashboardCache;
}

function asObject(payload) {
  if (payload?.data && !Array.isArray(payload.data)) return payload.data;
  return payload && typeof payload === 'object' ? payload : {};
}

function asList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function formatStudentName(student) {
  if (student?.name) return student.name;
  const first = student?.first_name || student?.firstname || '';
  const last = student?.last_name || student?.lastname || '';
  const full = `${first} ${last}`.trim();
  return full || 'Unknown Student';
}

function normalizeStudentsForUI(payload) {
  const resource = normalizeResource(payload);
  return {
    data: resource.data.map((student) => ({
      ...student,
      id: student.id,
      student_id: student.student_id || student.student_no || student.school_id || String(student.id),
      name: formatStudentName(student),
      email: student.email || '-',
      course:
        student.course?.code ||
        student.course?.name ||
        student.course_code ||
        student.course_name ||
        '-',
      year_level: student.year_level || student.year || '-',
      status: (student.status || 'enrolled').toLowerCase(),
    })),
    meta: resource.meta,
  };
}

function normalizeProgramsFromCourses(payload) {
  const normalizeProgramType = (value) => {
    const raw = String(value || '')
      .toLowerCase()
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (raw.includes('master')) return "Master's";
    if (raw.includes('diploma')) return 'Diploma';
    if (raw.includes('bachelor')) return "Bachelor's";

    return value ? String(value).trim() : "Bachelor's";
  };

  const normalizeProgramStatus = (value) => {
    const raw = String(value || 'active')
      .toLowerCase()
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (raw.includes('phase') && raw.includes('out')) return 'phased out';
    if (raw.includes('under') && raw.includes('review')) return 'under review';
    if (raw === 'inactive') return 'phased out';
    return 'active';
  };

  const resource = normalizeResource(payload);
  return {
    data: resource.data.map((course) => ({
      ...course,
      id: course.id,
      code: course.code || course.course_code || `CRS-${course.id}`,
      name: course.name || course.title || 'Unnamed Course',
      type: normalizeProgramType(
        course.type ||
          course.level ||
          course.program_type ||
          course.degree_type ||
          course.course_type ||
          course.program_level ||
          course.qualification,
      ),
      duration: course.duration || (course.years ? `${course.years} years` : 'N/A'),
      total_units: course.total_units || course.units || 0,
      status: normalizeProgramStatus(
        course.status || course.course_status || course.program_status || course.state,
      ),
      description: course.description || '',
      year_levels: course.year_levels || {},
      added_at: course.created_at || null,
    })),
    meta: resource.meta,
  };
}

function getProgramStatusOverrides() {
  try {
    const raw = localStorage.getItem(PROGRAM_STATUS_OVERRIDES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function setProgramStatusOverride(id, status) {
  if (!id || !status) return;

  const normalizedStatus = String(status)
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const current = getProgramStatusOverrides();
  current[String(id)] = normalizedStatus;
  localStorage.setItem(PROGRAM_STATUS_OVERRIDES_KEY, JSON.stringify(current));
}

function applyProgramStatusOverrides(programs) {
  const overrides = getProgramStatusOverrides();

  if (!Array.isArray(programs) || Object.keys(overrides).length === 0) {
    return programs;
  }

  return programs.map((program) => {
    const override = overrides[String(program.id)];
    if (!override) return program;
    return { ...program, status: override };
  });
}

function getProgramTypeOverrides() {
  try {
    const raw = localStorage.getItem(PROGRAM_TYPE_OVERRIDES_KEY);
    if (!raw) {
      return { byId: {}, byCode: {} };
    }

    const parsed = JSON.parse(raw);
    const byId = parsed?.byId && typeof parsed.byId === 'object' ? parsed.byId : {};
    const byCode = parsed?.byCode && typeof parsed.byCode === 'object' ? parsed.byCode : {};
    return { byId, byCode };
  } catch {
    return { byId: {}, byCode: {} };
  }
}

function setProgramTypeOverride({ id, code, type }) {
  if (!type) return;

  const value = String(type).trim();
  if (!value) return;

  const current = getProgramTypeOverrides();

  if (id) {
    current.byId[String(id)] = value;
  }

  if (code) {
    current.byCode[String(code).trim().toUpperCase()] = value;
  }

  localStorage.setItem(PROGRAM_TYPE_OVERRIDES_KEY, JSON.stringify(current));
}

function applyProgramTypeOverrides(programs) {
  const overrides = getProgramTypeOverrides();
  const hasAny =
    Object.keys(overrides.byId || {}).length > 0 ||
    Object.keys(overrides.byCode || {}).length > 0;

  if (!Array.isArray(programs) || !hasAny) {
    return programs;
  }

  return programs.map((program) => {
    const byId = overrides.byId?.[String(program.id)];
    const byCode = overrides.byCode?.[String(program.code || '').trim().toUpperCase()];
    const override = byId || byCode;

    if (!override) return program;
    return { ...program, type: override };
  });
}

function normalizeSubjects(payload) {
  const resource = normalizeResource(payload);
  return {
    data: resource.data.map((item) => ({
      ...item,
      id: item.id,
      code: item.code || item.subject_code || item.course_code || `SUB-${item.id}`,
      title: item.title || item.name || 'Untitled Subject',
      units: item.units || item.credit_units || 0,
      semester_offer: (item.semester_offer || item.offer_type || 'semester').toLowerCase(),
      term_offer: item.term_offer || item.semester || '',
      program_code: item.program_code || item.course_code || item.course?.code || '-',
      description: item.description || '',
      prerequisites: item.prerequisites || item.pre_requisites || [],
      co_requisites: item.co_requisites || item.corequisites || [],
    })),
    meta: resource.meta,
  };
}

function normalizeBarChart(list) {
  return list.map((item, index) => ({
    name: item.name || item.label || item.month || item.day || `Point ${index + 1}`,
    enrollments: Number(item.enrollments ?? item.count ?? item.value ?? 0),
  }));
}

function normalizePieChart(list) {
  return list.map((item, index) => ({
    name: item.name || item.label || `Category ${index + 1}`,
    value: Number(item.value ?? item.count ?? item.total ?? 0),
    fill: item.fill || item.color || CHART_COLORS[index % CHART_COLORS.length],
  }));
}

function normalizeLineChart(list) {
  return list.map((item, index) => ({
    day: item.day || item.name || item.label || item.date || `Day ${index + 1}`,
    attendance: Number(item.attendance ?? item.percentage ?? item.rate ?? item.value ?? 0),
  }));
}

function normalizeSchoolDays(payload) {
  const resource = normalizeResource(payload);

  if (Array.isArray(resource.data)) {
    return {
      data: resource.data,
      meta: resource.meta,
    };
  }

  if (resource.data && typeof resource.data === 'object') {
    const grouped = [];

    const pushGrouped = (list, type) => {
      if (!Array.isArray(list)) return;
      list.forEach((item) => {
        if (item && typeof item === 'object') {
          grouped.push({ ...item, type: item.type || item.day_type || type });
          return;
        }
        grouped.push({ date: item, type });
      });
    };

    pushGrouped(resource.data.school_days, 'school-day');
    pushGrouped(resource.data.schoolDays, 'school-day');
    pushGrouped(resource.data.days, 'school-day');
    pushGrouped(resource.data.special_school_days, 'special-school-day');
    pushGrouped(resource.data.specialSchoolDays, 'special-school-day');
    pushGrouped(resource.data.special_days, 'special-school-day');
    pushGrouped(resource.data.holidays, 'holiday');
    pushGrouped(resource.data.holiday_days, 'holiday');

    if (grouped.length > 0) {
      return {
        data: grouped,
        meta: resource.meta,
      };
    }

    const dateKeyRows = [];
    Object.entries(resource.data).forEach(([key, value]) => {
      if (!/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(key)) {
        return;
      }

      if (value && typeof value === 'object') {
        dateKeyRows.push({ date: key, ...value });
        return;
      }

      dateKeyRows.push({ date: key, type: value });
    });

    if (dateKeyRows.length > 0) {
      return {
        data: dateKeyRows,
        meta: resource.meta,
      };
    }

    const nested =
      resource.data.days ||
      resource.data.school_days ||
      resource.data.items ||
      resource.data.data;

    if (Array.isArray(nested)) {
      return {
        data: nested,
        meta: resource.meta,
      };
    }
  }

  return { data: [], meta: resource.meta };
}

function normalizeEnrollmentsFromStudents(payload) {
  const students = normalizeResource(payload).data;
  const rows = [];

  students.forEach((student) => {
    const collections = [
      student.courses,
      student.enrolled_courses,
      student.course_enrollments,
    ].filter(Array.isArray);

    collections.forEach((courses) => {
      courses.forEach((course, index) => {
        rows.push({
          id: `${student.id}-${course.id || course.course_id || index}`,
          student_name: formatStudentName(student),
          course_code: course.code || course.course_code || course.name || '-',
          enrolled_at: course?.pivot?.created_at || course.created_at || student.updated_at || '-',
          status: (course?.pivot?.status || course.status || 'confirmed').toLowerCase(),
        });
      });
    });
  });

  return {
    data: rows,
    meta: {
      total: rows.length,
      pending: rows.filter((item) => item.status === 'pending').length,
    },
  };
}

function pickListFromDashboard(payload, keys) {
  const root = asObject(payload);
  for (const key of keys) {
    if (Array.isArray(root[key])) {
      return root[key];
    }
    if (Array.isArray(root?.charts?.[key])) {
      return root.charts[key];
    }
  }
  return [];
}

export const authService = {
  async login({ email, password }) {
    const payload = await request(ROUTES.login, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const token = payload?.token || payload?.access_token || payload?.data?.token;
    if (!token) {
      throw new Error('Login succeeded but no token was returned by backend.');
    }

    const rawExpiresAt = payload?.expires_at || payload?.data?.expires_at;
    const computedExpiresAt =
      typeof rawExpiresAt === 'number'
        ? rawExpiresAt
        : rawExpiresAt
          ? Date.parse(rawExpiresAt)
          : Date.now() + 1000 * 60 * 60;

    const session = {
      token,
      expiresAt: Number.isFinite(computedExpiresAt)
        ? computedExpiresAt
        : Date.now() + 1000 * 60 * 60,
      user: payload?.user || payload?.data?.user || { name: 'Authenticated User', email },
    };

    // Persist token first so follow-up requests (e.g., /me) automatically include auth header.
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    const profile = await requestOrNull(ROUTES.me, { method: 'GET' });
    if (profile) {
      const nextSession = { ...session, user: profile?.data ?? profile };
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
      return nextSession;
    }

    return session;
  },

  async logout() {
    try {
      await requestOrNull(ROUTES.logout, { method: 'POST' });
    } catch {
      // Always clear local session even if backend logout fails.
    }
    localStorage.removeItem(SESSION_KEY);
  },

  getStoredSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw);
      if (!parsed.token || !parsed.user) {
        return null;
      }
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  },
};

export const dashboardService = {
  async getOverview() {
    dashboardCache = null;
    const payload = await getDashboardPayload();
    const root = asObject(payload);
    return root.overview || root.stats || root;
  },

  async getMonthlyEnrollment() {
    const direct = await requestOrNull(ROUTES.dashboardMonthlyEnrollment, { method: 'GET' });
    if (direct) {
      return asList(direct);
    }
    const payload = await getDashboardPayload();
    return normalizeBarChart(
      pickListFromDashboard(payload, ['monthly_enrollment', 'enrollment_trend', 'monthlyEnrollment']),
    );
  },

  async getCourseDistribution() {
    const direct = await requestOrNull(ROUTES.dashboardCourseDistribution, { method: 'GET' });
    if (direct) {
      return asList(direct);
    }
    const payload = await getDashboardPayload();
    return normalizePieChart(
      pickListFromDashboard(payload, ['course_distribution', 'courses_distribution', 'courseDistribution']),
    );
  },

  async getAttendancePattern() {
    const direct = await requestOrNull(ROUTES.dashboardAttendancePattern, { method: 'GET' });
    if (direct) {
      return normalizeLineChart(asList(direct));
    }
    const payload = await getDashboardPayload();
    const fromDashboard = pickListFromDashboard(payload, [
      'attendance_pattern',
      'attendance_trend',
      'attendancePattern',
    ]);

    if (fromDashboard.length > 0) {
      return normalizeLineChart(fromDashboard);
    }

    const schoolDays = await requestOrNull(ROUTES.schoolDays, { method: 'GET' });
    return normalizeLineChart(asList(schoolDays));
  },
};

export const studentService = {
  async getAll() {
    const payload = await requestAllPages(ROUTES.students);
    return normalizeStudentsForUI(payload);
  },
};

export const enrollmentService = {
  async getAll() {
    const direct = await requestAllPagesOrNull(ROUTES.enrollments);
    if (direct) {
      return normalizeResource(direct);
    }

    const studentsPayload = await requestAllPages(ROUTES.students);
    return normalizeEnrollmentsFromStudents(studentsPayload);
  },

  async create(data) {
    if (!data?.studentId || !data?.courseId) {
      throw new Error('Enrollment requires studentId and courseId.');
    }

    return request(`/students/${data.studentId}/courses/${data.courseId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async remove({ studentId, courseId }) {
    if (!studentId || !courseId) {
      throw new Error('Unenrollment requires studentId and courseId.');
    }

    return request(`/students/${studentId}/courses/${courseId}`, {
      method: 'DELETE',
    });
  },
};

export const schoolCalendarService = {
  async getAll(options = {}) {
    const params = new URLSearchParams();
    if (options.all === true) {
      params.set('all', '1');
    }
    if (options.perPageAll === true) {
      params.set('per_page', 'all');
    }
    if (options.month) {
      params.set('month', String(options.month));
    }
    if (options.year) {
      params.set('year', String(options.year));
    }
    if (options.schoolYear) {
      params.set('school_year', String(options.schoolYear));
    }
    if (options.schoolYearStart) {
      params.set('school_year_start', String(options.schoolYearStart));
    }
    if (options.schoolYearEnd) {
      params.set('school_year_end', String(options.schoolYearEnd));
    }

    const query = params.toString();
    const path = query ? `${ROUTES.schoolDays}?${query}` : ROUTES.schoolDays;

    const payload = await requestOrNull(path, { method: 'GET' });
    if (!payload) {
      return { data: [], meta: {} };
    }
    return normalizeSchoolDays(payload);
  },
};

export const catalogService = {
  async getPrograms() {
    const payload = await request(ROUTES.courses, { method: 'GET' });
    const normalized = normalizeProgramsFromCourses(payload);
    const withStatus = applyProgramStatusOverrides(normalized.data);
    const withType = applyProgramTypeOverrides(withStatus);
    return {
      ...normalized,
      data: withType,
    };
  },

  async createProgram(data) {
    const code = String(data?.code || '').trim().toUpperCase();
    const name = String(data?.name || '').trim();
    const department = String(data?.department || '').trim();

    if (!code || !name || !department) {
      throw new Error('Program code, program name, and department are required.');
    }

    const duration = String(data?.duration || '').trim();
    const totalUnits = Number(data?.totalUnits ?? 0);
    const units = Number(data?.units ?? data?.unitsPerTerm ?? 0);
    const capacity = Number(data?.capacity ?? 0);
    const status = String(data?.status || 'active').toLowerCase();
    const type = String(data?.type || "Bachelor's").trim();
    const departmentId = Number(data?.departmentId);
    const departmentCode = String(data?.departmentCode || '').trim();

    const attempts = [
      {
        path: ROUTES.courses,
        options: {
          method: 'POST',
          body: JSON.stringify({
            code,
            name,
            course_code: code,
            course_name: name,
            duration,
            years: duration,
            total_units: Number.isFinite(totalUnits) && totalUnits > 0 ? totalUnits : undefined,
            units: Number.isFinite(units) && units > 0 && units <= 10 ? units : undefined,
            capacity: Number.isFinite(capacity) && capacity > 0 ? capacity : undefined,
            status,
            course_status: status.replace(/\s+/g, '_'),
            type,
            level: type,
            program_type: type,
            degree_type: type,
            department,
            department_name: department,
            department_id: Number.isFinite(departmentId) && departmentId > 0 ? departmentId : undefined,
            department_code: departmentCode || undefined,
          }),
        },
      },
      {
        path: '/programs',
        options: {
          method: 'POST',
          body: JSON.stringify({
            code,
            name,
            status,
            course_status: status.replace(/\s+/g, '_'),
            duration,
            total_units: Number.isFinite(totalUnits) && totalUnits > 0 ? totalUnits : undefined,
            units: Number.isFinite(units) && units > 0 && units <= 10 ? units : undefined,
            capacity: Number.isFinite(capacity) && capacity > 0 ? capacity : undefined,
            type,
            level: type,
            program_type: type,
            degree_type: type,
            department,
            department_name: department,
            department_id: Number.isFinite(departmentId) && departmentId > 0 ? departmentId : undefined,
            department_code: departmentCode || undefined,
          }),
        },
      },
    ];

    let lastError = null;

    for (const attempt of attempts) {
      try {
        const response = await request(attempt.path, attempt.options);
        const responseId = response?.data?.id || response?.id || null;
        setProgramTypeOverride({ id: responseId, code, type });
        return response;
      } catch (error) {
        lastError = error;
        if (error?.status === 404 || error?.status === 405) {
          continue;
        }
        throw error;
      }
    }

    if (lastError) {
      throw lastError;
    }

    throw new Error('Unable to create program. No valid endpoint was found.');
  },

  async updateProgramStatus({ id, status }) {
    if (!id) {
      throw new Error('Program status update requires program id.');
    }

    if (!status) {
      throw new Error('Program status update requires status.');
    }

    const normalizedStatus = String(status)
      .toLowerCase()
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const apiStatus = normalizedStatus.replace(/\s+/g, '_');

    const attempts = [
      {
        path: `${ROUTES.courses}/${id}`,
        options: {
          method: 'PATCH',
          body: JSON.stringify({ status: normalizedStatus, course_status: apiStatus }),
        },
      },
      {
        path: `${ROUTES.courses}/${id}`,
        options: {
          method: 'PUT',
          body: JSON.stringify({ status: normalizedStatus, course_status: apiStatus }),
        },
      },
      {
        path: `${ROUTES.courses}/${id}`,
        options: {
          method: 'PATCH',
          body: JSON.stringify({ course_status: apiStatus, status: normalizedStatus }),
        },
      },
      {
        path: `/programs/${id}`,
        options: {
          method: 'PATCH',
          body: JSON.stringify({ status: normalizedStatus, course_status: apiStatus }),
        },
      },
    ];

    let lastError = null;

    for (const attempt of attempts) {
      try {
        const response = await request(attempt.path, attempt.options);
        setProgramStatusOverride(id, normalizedStatus);
        return response;
      } catch (error) {
        lastError = error;
        if (error?.status === 404 || error?.status === 405) {
          continue;
        }

        if (error?.status === 401 || error?.status === 403) {
          throw error;
        }

        setProgramStatusOverride(id, normalizedStatus);
        return {
          localOnly: true,
          message: 'Status updated locally. Backend update failed.',
        };
      }
    }

    if (lastError) {
      if (lastError?.status === 401 || lastError?.status === 403) {
        throw lastError;
      }

      setProgramStatusOverride(id, normalizedStatus);
      return {
        localOnly: true,
        message: 'Status updated locally. Backend endpoint not found.',
      };
    }

    setProgramStatusOverride(id, normalizedStatus);
    return {
      localOnly: true,
      message: 'Status updated locally.',
    };
  },

  async getSubjects() {
    const direct = await requestOrNull(ROUTES.subjects, { method: 'GET' });
    if (direct) {
      return normalizeSubjects(direct);
    }

    // If subject endpoint is not present, derive a basic subject list from courses.
    const coursesPayload = await request(ROUTES.courses, { method: 'GET' });
    return normalizeSubjects(coursesPayload);
  },
};
