const SESSION_KEY = 'session';
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
  const resource = normalizeResource(payload);
  return {
    data: resource.data.map((course) => ({
      ...course,
      id: course.id,
      code: course.code || course.course_code || `CRS-${course.id}`,
      name: course.name || course.title || 'Unnamed Course',
      type: course.type || course.level || 'Course',
      duration: course.duration || (course.years ? `${course.years} years` : 'N/A'),
      total_units: course.total_units || course.units || 0,
      status: (course.status || 'active').toLowerCase(),
      description: course.description || '',
      year_levels: course.year_levels || {},
      added_at: course.created_at || null,
    })),
    meta: resource.meta,
  };
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
    const payload = await request(ROUTES.students, { method: 'GET' });
    return normalizeStudentsForUI(payload);
  },
};

export const enrollmentService = {
  async getAll() {
    const direct = await requestOrNull(ROUTES.enrollments, { method: 'GET' });
    if (direct) {
      return normalizeResource(direct);
    }

    const studentsPayload = await request(ROUTES.students, { method: 'GET' });
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

export const catalogService = {
  async getPrograms() {
    const payload = await request(ROUTES.courses, { method: 'GET' });
    return normalizeProgramsFromCourses(payload);
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
