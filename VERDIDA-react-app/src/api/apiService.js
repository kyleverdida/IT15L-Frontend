import {
  catalogService,
  dashboardService,
  enrollmentService,
  studentService,
} from '../services/api';

export const api = {
  getStudents: () => studentService.getAll(),
  getEnrollments: () => enrollmentService.getAll(),
  createEnrollment: (data) => enrollmentService.create(data),

  getOverviewStats: () => dashboardService.getOverview(),
  getEnrollmentTrend: () => dashboardService.getMonthlyEnrollment(),
  getDashboardStats: () => dashboardService.getOverview(),

  getPrograms: () => catalogService.getPrograms(),
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
