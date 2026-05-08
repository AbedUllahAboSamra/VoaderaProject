export enum TaskStatus {
  Pending = 'PENDING',
  InProgress = 'IN_PROGRESS',
  Done = 'DONE',
  Overdue = 'OVERDUE',
  NotStarted = 'not_started',
}

export enum PerformanceLevel {
  Red = 'RED', // ضعيف
  Yellow = 'YELLOW', // متوسط
  Green = 'GREEN', // جيد
  White = 'WHITE', // ممتاز / غير مقيم
}

export enum RoleType {
  Admin = 'ADMIN',
  HR = 'HR',
  Manager = 'MANAGER',
  Employee = 'EMPLOYEE',
}

export interface Department {
  id: number;
  name: string;
  description?: string;

  managerId?: number;

  employeeIds: number[];
  groupIds: number[];
  taskIds: number[];
}

export interface Employee {
  id: number;

  // Identity
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;

  // Organization
  roleId: number;
  departmentId: number;

  groupIds: number[];

  // HR Info
  hireDate: Date;
  contractType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';

  salary?: number;

  isActive: boolean;

  // Stats (اختياري)
  totalTasksCompleted?: number;
  totalHoursWorked?: number;
  performanceScore?: number;
}

export interface Group {
  id: number;

  name: string;

  departmentId: number;
  managerId: number;

  memberIds: number[];

  taskIds: number[];

  createdAt: Date;
}
export interface Role {
  id: number;
  name: RoleType;

  permissions: string[];

  level: number; // 🔥 مهم للـ hierarchy
}
export interface Task {
  id: number;

  // Basic Info
  title: string;
  description?: string;

  // Relations (IMPORTANT)
  departmentId: number;
  createdById: number;

  assignedToEmployeeId?: number;
  assignedToGroupId?: number;

  reviewerId?: number; // HR / Manager المسؤول عن التقييم

  // Dates
  startDate: Date;
  endDate: Date;
  completedAt?: Date;

  // Status
  status: TaskStatus;

  // Work Tracking
  hoursEstimated: number;
  hoursSpent: number;

  // Progress
  progressPercent: number; // 🔥 0 - 100

  // Relations
  signatureIds: number[];
  evaluationIds: number[];

  // Priority (مهم جداً)
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}
export interface TaskSignature {
  id: number;
  taskId: number;
  employeeId: number;

  signedAt: Date;
  signatureBase64: string;
}

export interface Evaluation {
  id: number;

  taskId: number;
  employeeId: number;

  evaluatedById: number;

  score: number; // 0 - 100
  performanceLevel: PerformanceLevel;

  // breakdown (🔥 مهم للتفصيل)
  qualityScore: number;
  speedScore: number;
  collaborationScore: number;

  notes?: string;

  evaluatedAt: Date;
}
export interface WorkLog {
  id: number;

  taskId: number;
  employeeId: number;

  date: Date;

  hours: number;

  description?: string;

  isBillable: boolean;
}
export const departments: Department[] = [
  {
    id: 1,
    name: 'Software',
    description: 'Development Department',
    managerId: 1,
    employeeIds: [1, 2],
    groupIds: [1],
    taskIds: [1],
  },
  {
    id: 2,
    name: 'HR',
    description: 'Human Resources',
    managerId: 3,
    employeeIds: [3],
    groupIds: [],
    taskIds: [],
  },
];
export const employees: Employee[] = [
  {
    id: 1,
    fullName: 'Ahmad Ali',
    email: 'ahmad@company.com',
    roleId: 3,
    departmentId: 1,
    groupIds: [1],
    hireDate: new Date('2024-01-10'),
    contractType: 'FULL_TIME',
    isActive: true,
    totalTasksCompleted: 5,
    totalHoursWorked: 120,
    performanceScore: 88,
  },
  {
    id: 2,
    fullName: 'Sara Yasin',
    email: 'sara@company.com',
    roleId: 4,
    departmentId: 1,
    groupIds: [1],
    hireDate: new Date('2024-02-01'),
    contractType: 'FULL_TIME',
    isActive: true,
  },
  {
    id: 3,
    fullName: 'Mona HR',
    email: 'mona@company.com',
    roleId: 2,
    departmentId: 2,
    groupIds: [],
    hireDate: new Date('2023-06-01'),
    contractType: 'FULL_TIME',
    isActive: true,
  },
];
export const groups: Group[] = [
  {
    id: 1,
    name: 'Frontend Team',
    departmentId: 1,
    managerId: 1,
    memberIds: [2],
    taskIds: [1],
    createdAt: new Date(),
  },
];
export const tasks: Task[] = [
  {
    id: 1,
    title: 'Build Login Page',
    description: 'Angular + API integration',
    departmentId: 1,
    createdById: 1,
    assignedToGroupId: 1,

    startDate: new Date('2026-05-01'),
    endDate: new Date('2026-05-10'),

    status: TaskStatus.InProgress,

    hoursEstimated: 20,
    hoursSpent: 8,
    progressPercent: 40,

    priority: 'HIGH',

    signatureIds: [1],
    evaluationIds: [1],
  }, {
    id: 2,
    title: 'Build Login Page',
    description: 'Angular + API integration',
    departmentId: 1,
    createdById: 1,
    assignedToGroupId: 1,

    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-07-10'),

    status: TaskStatus.Pending,

    hoursEstimated: 20,
    hoursSpent: 8,
    progressPercent: 40,

    priority: 'HIGH',

    signatureIds: [1],
    evaluationIds: [1],
  }, {
    id: 3,
    title: 'Build Login Page',
    description: 'Angular + API integration',
    departmentId: 1,
    createdById: 1,
    assignedToGroupId: 1,

    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-07-10'),

    status: TaskStatus.Done,

    hoursEstimated: 20,
    hoursSpent: 8,
    progressPercent: 40,

    priority: 'HIGH',

    signatureIds: [1],
    evaluationIds: [1],
  },
];
export const taskSignatures: TaskSignature[] = [
  {
    id: 1,
    taskId: 1,
    employeeId: 2,
    signedAt: new Date(),
    signatureBase64: 'base64-signature',
  },
];
export const evaluations: Evaluation[] = [
  {
    id: 1,
    taskId: 1,
    employeeId: 2,
    evaluatedById: 3,

    score: 85,
    performanceLevel: PerformanceLevel.Green,

    qualityScore: 90,
    speedScore: 80,
    collaborationScore: 85,

    notes: 'Good work overall',

    evaluatedAt: new Date(),
  },
];
export const roles: Role[] = [
  {
    id: 1,
    name: RoleType.Admin,
    permissions: ['ALL'],
    level: 1,
  },
  {
    id: 2,
    name: RoleType.HR,
    permissions: ['EMPLOYEES_READ', 'EMPLOYEES_WRITE', 'TASKS_REVIEW'],
    level: 2,
  },
  {
    id: 3,
    name: RoleType.Manager,
    permissions: ['TASKS_MANAGE', 'TEAM_VIEW'],
    level: 3,
  },
  {
    id: 4,
    name: RoleType.Employee,
    permissions: ['TASKS_VIEW', 'TASKS_UPDATE'],
    level: 4,
  },
];
export const workLogs: WorkLog[] = [
  {
    id: 1,
    taskId: 1,
    employeeId: 2,
    date: new Date(),
    hours: 4,
    description: 'Login UI development',
    isBillable: true,
  },
];
