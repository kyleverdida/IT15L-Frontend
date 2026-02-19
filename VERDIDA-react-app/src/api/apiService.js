/**
 * API Service layer - Ready for Laravel REST integration
 * Replace mock calls with fetch/axios to your Laravel backend
 * Base URL will be: process.env.VITE_API_URL || 'http://localhost:8000/api'
 */

import {
  mockStudents,
  mockCourses,
  mockEnrollments,
  mockOverviewStats,
  mockEnrollmentTrend,
} from './mockData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Simulate API delay for realistic feel
const simulateApiCall = async (data, ms = 300) => {
  await delay(ms);
  return data;
};

export const api = {
  // Students
  getStudents: (page = 1) => simulateApiCall(mockStudents),
  getStudent: (id) => simulateApiCall(mockStudents.data.find((s) => s.id === id)),

  // Courses
  getCourses: () => simulateApiCall(mockCourses),
  getCourse: (id) => simulateApiCall(mockCourses.data.find((c) => c.id === id)),

  // Enrollments
  getEnrollments: () => simulateApiCall(mockEnrollments),
  createEnrollment: (data) => simulateApiCall({ data: { id: 99, ...data } }, 500),

  // Dashboard
  getOverviewStats: () => simulateApiCall(mockOverviewStats),
  getEnrollmentTrend: () => simulateApiCall(mockEnrollmentTrend),

  // Future: Replace with actual fetch
  // getStudents: (page) => fetch(`${API_BASE}/students?page=${page}`).then(r => r.json()),
};
