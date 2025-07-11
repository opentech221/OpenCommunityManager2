export interface AssociationType {
  id: string;
  name: string;
  sigle?: string;
  email: string;
  phone: string;
  logo?: string;
  description?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: MemberRole;
  status: MemberStatus;
  joinDate: Date;
  associationId: string;
}

export const MemberRole = {
  PRESIDENT: 'PRESIDENT',
  VICE_PRESIDENT: 'VICE_PRESIDENT',
  SECRETARY: 'SECRETARY',
  TREASURER: 'TREASURER',
  MEMBER: 'MEMBER'
} as const;
export type MemberRole = typeof MemberRole[keyof typeof MemberRole];

export const MemberStatus = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  INACTIVE: 'INACTIVE'
} as const;
export type MemberStatus = typeof MemberStatus[keyof typeof MemberStatus];

export interface CotisationType {
  id: string;
  memberId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  year: number;
  notes?: string;
}

export const PaymentMethod = {
  CASH: 'CASH',
  BANK_TRANSFER: 'BANK_TRANSFER',
  MOBILE_MONEY: 'MOBILE_MONEY',
  CHECK: 'CHECK'
} as const;
export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export const PaymentStatus = {
  PAID: 'PAID',
  PENDING: 'PENDING',
  OVERDUE: 'OVERDUE'
} as const;
export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export interface EventType {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  location: string;
  type: EventTypeEnum;
  status: EventStatus;
  maxParticipants?: number;
  associationId: string;
  createdBy?: string;
  participants: EventParticipant[];
  createdAt: Date;
  updatedAt: Date;
}

export const EventTypeEnum = {
  MEETING: 'MEETING',
  TRAINING: 'TRAINING',
  SOCIAL: 'SOCIAL',
  FUNDRAISING: 'FUNDRAISING',
  OTHER: 'OTHER'
} as const;
export type EventTypeEnum = typeof EventTypeEnum[keyof typeof EventTypeEnum];

export const EventStatus = {
  PLANNED: 'PLANNED',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const;
export type EventStatus = typeof EventStatus[keyof typeof EventStatus];

export interface EventParticipant {
  memberId: string;
  registrationDate: Date;
  attended: boolean;
}

export interface TransactionType {
  id: string;
  type: TransactionTypeEnum;
  amount: number;
  description: string;
  date: Date;
  category: string;
  associationId: string;
  receipt?: string;
}

export const TransactionTypeEnum = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE'
} as const;
export type TransactionTypeEnum = typeof TransactionTypeEnum[keyof typeof TransactionTypeEnum];

export interface DocumentType {
  id: string;
  name: string;
  type: DocumentTypeEnum;
  url: string;
  uploadDate: Date;
  uploadedBy: string;
  associationId: string;
  size: number;
}

export const DocumentTypeEnum = {
  PV: 'PV',
  FINANCIAL_REPORT: 'FINANCIAL_REPORT',
  STATUTES: 'STATUTES',
  OTHER: 'OTHER'
} as const;
export type DocumentTypeEnum = typeof DocumentTypeEnum[keyof typeof DocumentTypeEnum];

export interface MessageType {
  id: string;
  senderId: string;
  recipientId?: string;
  subject: string;
  content: string;
  sentAt: Date;
  isRead: boolean;
  associationId: string;
}

export interface UserType {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  associationId?: string;
  createdAt: Date;
}

export const UserRole = {
  ADMIN: 'ADMIN',
  ASSOCIATION_ADMIN: 'ASSOCIATION_ADMIN',
  MEMBER: 'MEMBER'
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];
