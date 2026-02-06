export const MOCK_MARKS = [
  { subject: "Data Structures", midterm: 38, final: 85, assignment: 18, total: 141, maxTotal: 150, grade: "A" },
  { subject: "Operating Systems", midterm: 32, final: 72, assignment: 20, total: 124, maxTotal: 150, grade: "B+" },
  { subject: "Database Systems", midterm: 40, final: 90, assignment: 19, total: 149, maxTotal: 150, grade: "A+" },
  { subject: "Computer Networks", midterm: 35, final: 78, assignment: 17, total: 130, maxTotal: 150, grade: "A" },
  { subject: "Software Engineering", midterm: 30, final: 68, assignment: 15, total: 113, maxTotal: 150, grade: "B" },
];

export const MOCK_ATTENDANCE = [
  { subject: "Data Structures", attended: 42, total: 45, percentage: 93 },
  { subject: "Operating Systems", attended: 38, total: 45, percentage: 84 },
  { subject: "Database Systems", attended: 44, total: 45, percentage: 98 },
  { subject: "Computer Networks", attended: 35, total: 45, percentage: 78 },
  { subject: "Software Engineering", attended: 40, total: 45, percentage: 89 },
];

export const MOCK_NOTICES = [
  { id: "n1", title: "Mid-Semester Exam Schedule Released", date: "2026-02-01", content: "Mid-semester exams will begin from March 10, 2026. Check the exam portal for your schedule.", priority: "high" as const },
  { id: "n2", title: "Annual Tech Fest Registration Open", date: "2026-01-28", content: "Register for TechVista 2026 before February 15. Early bird discounts available.", priority: "medium" as const },
  { id: "n3", title: "Library Hours Extended", date: "2026-01-25", content: "Library will remain open until 11 PM during exam season starting March 1.", priority: "low" as const },
  { id: "n4", title: "Placement Drive - InfoSys", date: "2026-01-20", content: "InfoSys campus placement drive on February 20. Eligible students must register by Feb 10.", priority: "high" as const },
];

export const MOCK_STUDY_MATERIALS = [
  { id: "m1", title: "DSA Complete Notes", subject: "Data Structures", uploadedBy: "Dr. Priya Mehta", date: "2026-01-15", fileSize: "2.4 MB" },
  { id: "m2", title: "OS Lecture Slides - Unit 3", subject: "Operating Systems", uploadedBy: "Prof. Anand Rao", date: "2026-01-20", fileSize: "5.1 MB" },
  { id: "m3", title: "SQL Practice Problems", subject: "Database Systems", uploadedBy: "Dr. Priya Mehta", date: "2026-01-22", fileSize: "1.8 MB" },
  { id: "m4", title: "Network Protocols Reference", subject: "Computer Networks", uploadedBy: "Prof. Kavitha S.", date: "2026-01-18", fileSize: "3.2 MB" },
];

export const MOCK_STUDENTS = [
  { id: "s1", rollNumber: "CS2024001", name: "Arjun Sharma", department: "Computer Science", semester: 4 },
  { id: "s2", rollNumber: "CS2024002", name: "Meera Patel", department: "Computer Science", semester: 4 },
  { id: "s3", rollNumber: "CS2024003", name: "Rahul Verma", department: "Computer Science", semester: 4 },
  { id: "s4", rollNumber: "EC2024001", name: "Sneha Iyer", department: "Electronics", semester: 4 },
];

export const MOCK_FACULTY = [
  { id: "f1", name: "Dr. Priya Mehta", department: "Computer Science", subjects: ["Data Structures", "Database Systems"] },
  { id: "f2", name: "Prof. Anand Rao", department: "Computer Science", subjects: ["Operating Systems"] },
  { id: "f3", name: "Prof. Kavitha S.", department: "Computer Science", subjects: ["Computer Networks"] },
];

export const MOCK_FEEDBACK = [
  { id: "fb1", studentName: "Arjun Sharma", faculty: "Dr. Priya Mehta", rating: 5, comment: "Excellent teaching methodology and very approachable.", date: "2026-01-10" },
  { id: "fb2", studentName: "Meera Patel", faculty: "Prof. Anand Rao", rating: 4, comment: "Good explanations but lectures can be a bit fast.", date: "2026-01-12" },
  { id: "fb3", studentName: "Rahul Verma", faculty: "Dr. Priya Mehta", rating: 5, comment: "Best professor in the department.", date: "2026-01-14" },
];

export const SECURITY_QUESTIONS = [
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What city were you born in?",
  "What is your favorite book?",
  "What was the name of your first school?",
];
