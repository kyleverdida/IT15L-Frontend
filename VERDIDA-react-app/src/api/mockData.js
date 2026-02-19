/**
 * Mock data structured for Laravel REST API integration
 * Replace with actual API calls when backend is ready
 * Expected response formats mirror Laravel Resource/API conventions
 */

export const mockStudents = {
  data: [
    { id: 1, student_id: '2024-001', name: 'Maria Santos', email: 'maria.santos@example.com', course: 'BS Computer Science', year_level: 3, status: 'enrolled', avatar: null },
    { id: 2, student_id: '2024-002', name: 'Juan Dela Cruz', email: 'juan.delacruz@example.com', course: 'BS Information Technology', year_level: 2, status: 'enrolled', avatar: null },
    { id: 3, student_id: '2024-003', name: 'Ana Reyes', email: 'ana.reyes@example.com', course: 'BS Computer Science', year_level: 4, status: 'enrolled', avatar: null },
    { id: 4, student_id: '2024-004', name: 'Carlos Mendoza', email: 'carlos.mendoza@example.com', course: 'BS IT', year_level: 1, status: 'pending', avatar: null },
  ],
  meta: { total: 1240, current_page: 1, per_page: 10 }
};

export const mockCourses = {
  data: [
    { id: 1, code: 'CS101', title: 'Introduction to Programming', units: 3, department: 'Computer Science', slots: 45, enrolled: 42 },
    { id: 2, code: 'IT201', title: 'Database Management Systems', units: 3, department: 'Information Technology', slots: 40, enrolled: 38 },
    { id: 3, code: 'CS301', title: 'Data Structures and Algorithms', units: 4, department: 'Computer Science', slots: 35, enrolled: 35 },
    { id: 4, code: 'IT401', title: 'Web Development', units: 3, department: 'IT', slots: 50, enrolled: 28 },
  ],
  meta: { total: 48 }
};

export const mockEnrollments = {
  data: [
    { id: 1, student_name: 'Maria Santos', course_code: 'CS101', status: 'confirmed', enrolled_at: '2024-01-15' },
    { id: 2, student_name: 'Juan Dela Cruz', course_code: 'IT201', status: 'pending', enrolled_at: '2024-01-16' },
    { id: 3, student_name: 'Ana Reyes', course_code: 'CS301', status: 'confirmed', enrolled_at: '2024-01-14' },
    { id: 4, student_name: 'Carlos Mendoza', course_code: 'CS101', status: 'pending', enrolled_at: '2024-01-17' },
  ],
  meta: { total: 892, pending: 23 }
};

export const mockOverviewStats = {
  total_students: 1240,
  active_courses: 48,
  pending_fees: 12400,
  enrollment_this_week: 89,
};

export const mockEnrollmentTrend = [
  { name: 'Mon', enrollments: 42, students: 38 },
  { name: 'Tue', enrollments: 35, students: 32 },
  { name: 'Wed', enrollments: 58, students: 55 },
  { name: 'Thu', enrollments: 71, students: 68 },
  { name: 'Fri', enrollments: 89, students: 82 },
  { name: 'Sat', enrollments: 12, students: 10 },
];

export const mockCourseDistribution = [
  { name: 'BS CS', value: 520, fill: '#3b82f6' },
  { name: 'BS IT', value: 380, fill: '#10b981' },
  { name: 'BSIS', value: 210, fill: '#8b5cf6' },
  { name: 'Others', value: 130, fill: '#f59e0b' },
];

export const mockChatbotResponses = {
  greeting: "Hello! I'm EduBot. I can help with enrollment questions, course info, or guide you through the system. What would you like to know?",
  enrollment: "To enroll, go to the Enrollment section and click 'New Enrollment'. Select the student and course, then confirm.",
  courses: "You can view and manage all courses in the Courses section. Each course shows available slots and enrolled count.",
  default: "I'm still learning! For now, please check the relevant section (Students, Courses, or Enrollment) for the information you need.",
};
