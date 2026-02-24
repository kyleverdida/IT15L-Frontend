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
  { name: 'Others', value: 130, fill: '#f59e0b' },
];

export const mockChatbotResponses = {
  greeting: "Hello! I'm EduBot. I can help with enrollment questions, course info, or guide you through the system. What would you like to know?",
  enrollment: "To enroll, go to the Enrollment section and click 'New Enrollment'. Select the student and course, then confirm.",
  courses: "You can view and manage all courses in the Courses section. Each course shows available slots and enrolled count.",
  default: "I'm still learning! For now, please check the relevant section (Students, Courses, or Enrollment) for the information you need.",
};

// ========== Programs & Subjects (for Dashboard, Program Offerings, Subject Offerings) ==========

export const mockPrograms = {
  data: [
    {
      id: 1,
      code: 'BSIT',
      name: 'Bachelor of Science in Information Technology',
      type: "Bachelor's",
      duration: '4 years',
      total_units: 156,
      status: 'active',
      description: 'Prepares students for careers in software development, network administration, and IT management.',
      added_at: '2024-01-10',
      year_levels: {
        '1st year': [
          { id: 101, code: 'IT101', title: 'Introduction to Computing', units: 3, semester: '1st' },
          { id: 102, code: 'IT102', title: 'Programming Fundamentals', units: 4, semester: '1st' },
          { id: 103, code: 'MATH101', title: 'College Algebra', units: 3, semester: '1st' },
          { id: 104, code: 'IT103', title: 'Data Structures', units: 4, semester: '2nd' },
          { id: 105, code: 'IT104', title: 'Database Management', units: 3, semester: '2nd' },
        ],
        '2nd year': [
          { id: 106, code: 'IT201', title: 'Web Development', units: 3, semester: '1st' },
          { id: 107, code: 'IT202', title: 'Networking Fundamentals', units: 3, semester: '1st' },
          { id: 108, code: 'IT203', title: 'Object-Oriented Programming', units: 4, semester: '2nd' },
        ],
        '3rd year': [
          { id: 109, code: 'IT301', title: 'System Analysis and Design', units: 3, semester: '1st' },
          { id: 110, code: 'IT302', title: 'Mobile Application Development', units: 4, semester: '2nd' },
        ],
        '4th year': [
          { id: 111, code: 'IT401', title: 'IT Capstone Project', units: 6, semester: '1st' },
          { id: 112, code: 'IT402', title: 'Practicum', units: 6, semester: '2nd' },
        ],
      },
    },
    {
      id: 2,
      code: 'BSCS',
      name: 'Bachelor of Science in Computer Science',
      type: "Bachelor's",
      duration: '4 years',
      total_units: 168,
      status: 'active',
      description: 'Focuses on theoretical foundations of computing, algorithms, and software engineering.',
      added_at: '2024-01-08',
      year_levels: {
        '1st year': [
          { id: 201, code: 'CS101', title: 'Introduction to Computer Science', units: 3, semester: '1st' },
          { id: 202, code: 'CS102', title: 'Discrete Mathematics', units: 4, semester: '1st' },
          { id: 203, code: 'CS103', title: 'Data Structures and Algorithms', units: 4, semester: '2nd' },
        ],
        '2nd year': [
          { id: 204, code: 'CS201', title: 'Object-Oriented Programming', units: 4, semester: '1st' },
          { id: 205, code: 'CS202', title: 'Computer Architecture', units: 3, semester: '2nd' },
        ],
        '3rd year': [
          { id: 206, code: 'CS301', title: 'Operating Systems', units: 3, semester: '1st' },
          { id: 207, code: 'CS302', title: 'Database Systems', units: 3, semester: '2nd' },
        ],
        '4th year': [
          { id: 208, code: 'CS401', title: 'Software Engineering', units: 3, semester: '1st' },
          { id: 209, code: 'CS402', title: 'Capstone Project', units: 6, semester: '2nd' },
        ],
      },
    },
    {
      id: 4,
      code: 'DIT',
      name: 'Diploma in Information Technology',
      type: 'Diploma',
      duration: '2 years',
      total_units: 72,
      status: 'phased out',
      description: 'Short program for IT fundamentals (being phased out in favor of degree programs).',
      added_at: '2022-06-15',
      year_levels: {
        '1st year': [
          { id: 401, code: 'DIT101', title: 'IT Basics', units: 3, semester: '1st' },
          { id: 402, code: 'DIT102', title: 'Web Design', units: 3, semester: '2nd' },
        ],
        '2nd year': [
          { id: 403, code: 'DIT201', title: 'Networking', units: 3, semester: '1st' },
        ],
      },
    },
    {
      id: 5,
      code: 'MIT',
      name: 'Master of Information Technology',
      type: "Master's",
      duration: '2 years',
      total_units: 36,
      status: 'under review',
      description: 'Graduate program for advanced IT specialization.',
      added_at: '2024-01-20',
      year_levels: {
        '1st year': [
          { id: 501, code: 'MIT501', title: 'Advanced Databases', units: 3, semester: '1st' },
          { id: 502, code: 'MIT502', title: 'Cloud Computing', units: 3, semester: '2nd' },
        ],
        '2nd year': [
          { id: 503, code: 'MIT601', title: 'Thesis', units: 6, semester: '1st' },
        ],
      },
    },
  ],
  meta: { total: 4 },
};

export const mockSubjects = {
  data: [
    { id: 1, code: 'IT101', title: 'Introduction to Computing', units: 3, semester_offer: 'semester', term_offer: '1st', program_code: 'BSIT', description: 'Overview of computing concepts and applications.', prerequisites: [], co_requisites: [] },
    { id: 2, code: 'IT102', title: 'Programming Fundamentals', units: 4, semester_offer: 'semester', term_offer: '1st', program_code: 'BSIT', description: 'Basic programming using a high-level language.', prerequisites: [], co_requisites: [] },
    { id: 3, code: 'IT103', title: 'Data Structures', units: 4, semester_offer: 'semester', term_offer: '2nd', program_code: 'BSIT', description: 'Arrays, lists, trees, graphs, and algorithms.', prerequisites: ['IT102'], co_requisites: [] },
    { id: 4, code: 'IT104', title: 'Database Management', units: 3, semester_offer: 'semester', term_offer: '2nd', program_code: 'BSIT', description: 'Relational databases, SQL, normalization.', prerequisites: ['IT103'], co_requisites: [] },
    { id: 5, code: 'IT201', title: 'Web Development', units: 3, semester_offer: 'semester', term_offer: '1st', program_code: 'BSIT', description: 'HTML, CSS, JavaScript, and frameworks.', prerequisites: ['IT102', 'IT104'], co_requisites: [] },
    { id: 6, code: 'IT202', title: 'Networking Fundamentals', units: 3, semester_offer: 'semester', term_offer: '1st', program_code: 'BSIT', description: 'Network protocols, topology, and administration.', prerequisites: [], co_requisites: [] },
    { id: 7, code: 'IT203', title: 'Object-Oriented Programming', units: 4, semester_offer: 'semester', term_offer: '2nd', program_code: 'BSIT', description: 'OOP principles, design patterns.', prerequisites: ['IT103'], co_requisites: [] },
    { id: 8, code: 'IT301', title: 'System Analysis and Design', units: 3, semester_offer: 'semester', term_offer: '1st', program_code: 'BSIT', description: 'Requirements, modeling, UML.', prerequisites: ['IT203', 'IT201'], co_requisites: [] },
    { id: 9, code: 'IT302', title: 'Mobile Application Development', units: 4, semester_offer: 'semester', term_offer: '2nd', program_code: 'BSIT', description: 'Cross-platform mobile app development.', prerequisites: ['IT201'], co_requisites: ['IT301'] },
    { id: 10, code: 'IT401', title: 'IT Capstone Project', units: 6, semester_offer: 'semester', term_offer: '1st', program_code: 'BSIT', description: 'Capstone project integration.', prerequisites: ['IT301', 'IT302'], co_requisites: [] },
    { id: 11, code: 'CS101', title: 'Introduction to Computer Science', units: 3, semester_offer: 'semester', term_offer: '1st', program_code: 'BSCS', description: 'Foundations of computer science.', prerequisites: [], co_requisites: [] },
    { id: 12, code: 'CS102', title: 'Discrete Mathematics', units: 4, semester_offer: 'semester', term_offer: '1st', program_code: 'BSCS', description: 'Logic, sets, combinatorics.', prerequisites: [], co_requisites: [] },
    { id: 13, code: 'CS103', title: 'Data Structures and Algorithms', units: 4, semester_offer: 'semester', term_offer: '2nd', program_code: 'BSCS', description: 'Advanced data structures.', prerequisites: ['CS101'], co_requisites: ['CS102'] },
    { id: 14, code: 'CS201', title: 'Object-Oriented Programming', units: 4, semester_offer: 'semester', term_offer: '1st', program_code: 'BSCS', description: 'OOP and design patterns.', prerequisites: ['CS103'], co_requisites: [] },
    { id: 15, code: 'CS202', title: 'Computer Architecture', units: 3, semester_offer: 'semester', term_offer: '2nd', program_code: 'BSCS', description: 'CPU, memory, assembly.', prerequisites: ['CS103'], co_requisites: [] },
    { id: 16, code: 'IS101', title: 'Information Systems Fundamentals', units: 3, semester_offer: 'term', term_offer: '1st', program_code: 'BSIT', description: 'Introduction to IS.', prerequisites: [], co_requisites: [] },
    { id: 17, code: 'MATH101', title: 'College Algebra', units: 3, semester_offer: 'both', term_offer: '1st', program_code: 'BSIT', description: 'Algebra for computing.', prerequisites: [], co_requisites: [] },
  ],
  meta: { total: 17 },
};

export const mockDashboardStats = {
  total_programs: 4,
  total_subjects: 17,
  active_programs: 2,
  inactive_programs: 2,
  subjects_per_semester: 15,
  subjects_per_term: 1,
  subjects_both: 1,
  subjects_with_prerequisites: 9,
  recently_added: [
    { type: 'program', code: 'MIT', name: 'Master of Information Technology', added_at: '2024-01-20' },
    { type: 'program', code: 'BSCS', name: 'Bachelor of Science in Computer Science', added_at: '2024-01-08' },
    { type: 'subject', code: 'IS101', title: 'Information Systems Fundamentals', added_at: '2024-02-01' },
    { type: 'subject', code: 'MATH101', title: 'College Algebra', added_at: '2024-01-25' },
  ],
  subjects_per_semester_chart: [
    { name: '1st Semester', count: 8 },
    { name: '2nd Semester', count: 7 },
    { name: '1st Term', count: 1 },
    { name: '2nd Term', count: 0 },
  ],
  programs_by_status: [
    { name: 'Active', value: 2, fill: '#10b981' },
    { name: 'Phased Out', value: 1, fill: '#ef4444' },
    { name: 'Under Review', value: 1, fill: '#f59e0b' },
  ],
};
