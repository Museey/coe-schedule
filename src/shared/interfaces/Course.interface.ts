export interface Course {
    course_id: number;
    faculty_id: number;
    academic_year: number;
    semester: number;
    course_code: string;
    course_name: string;
    course_name_english: string;
    faculty_name: string;
    department_name: string;
    credits: string;
    prerequisite: string;
    study_days?: string[]; // Add this line to include study_days
    sections?: Section[];  // Optional, if sections are included
  }
  
  export interface Section {
    section: number;
    schedule: Schedule[];
  }
  
  export interface Schedule {
    day: string;
    time: string;
    room: string;
    instructor: string;
    format: string;
    note: string;
  }