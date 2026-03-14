import {
  catalogService,
  dashboardService,
  enrollmentService,
  schoolCalendarService,
  studentService,
} from '../services/api';

export const api = {
  getStudents: () => studentService.getAll(),
  getEnrollments: () => enrollmentService.getAll(),
  createEnrollment: (data) => enrollmentService.create(data),
  getSchoolDays: (options) => schoolCalendarService.getAll(options),

  getOverviewStats: () => dashboardService.getOverview(),
  getEnrollmentTrend: () => dashboardService.getMonthlyEnrollment(),
  getDashboardStats: () => dashboardService.getOverview(),

  getPrograms: () => catalogService.getPrograms(),
  createProgram: (data) => catalogService.createProgram(data),
  updateProgramStatus: (id, status) => catalogService.updateProgramStatus({ id, status }),
  getSubjects: () => catalogService.getSubjects(),

  async getProgram(id) {
    const response = await catalogService.getPrograms();
    return response.data.find((item) => item.id === Number(id));
  },

  async getSubject(id) {
    const response = await catalogService.getSubjects();
    return response.data.find((item) => item.id === Number(id));
  },
};
