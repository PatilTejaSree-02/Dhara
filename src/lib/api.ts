// src/lib/api.ts
import axios from 'axios';
import { sql } from '@vercel/postgres';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Database interfaces based on your Prisma schema
export interface Migrant {
  id: string;
  athidhiId: string;
  phoneNumber: string;
  name: string;
  gender?: string;
  dob?: Date;
  address?: string;
  pocId?: string;
  createdAt: Date;
}

export interface Doctor {
  id: string;
  hospitalId: string;
  name: string;
}

export interface POC {
  id: string;
  pocId: string;
  name: string;
}

export interface HealthRecord {
  id: string;
  migrantId: string;
  pocId?: string;
  doctorId?: string;
  symptoms: string;
  diagnosis?: string;
  prescription?: string;
  isNotifiable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Direct database operations using Vercel PostgreSQL
export const databaseAPI = {
  // Migrant operations
  getMigrants: async (): Promise<Migrant[]> => {
    const result = await sql`SELECT * FROM "Migrant" ORDER BY "createdAt" DESC`;
    return result.rows as Migrant[];
  },

  createMigrant: async (migrantData: Omit<Migrant, 'id' | 'createdAt'>): Promise<Migrant> => {
    const result = await sql`
      INSERT INTO "Migrant" ("id", "athidhiId", "phoneNumber", "name", "gender", "dob", "address", "pocId")
      VALUES (gen_random_uuid(), ${migrantData.athidhiId}, ${migrantData.phoneNumber}, ${migrantData.name}, ${migrantData.gender}, ${migrantData.dob}, ${migrantData.address}, ${migrantData.pocId})
      RETURNING *
    `;
    return result.rows[0] as Migrant;
  },

  getMigrantById: async (id: string): Promise<Migrant | null> => {
    const result = await sql`SELECT * FROM "Migrant" WHERE "id" = ${id}`;
    return result.rows[0] as Migrant || null;
  },

  updateMigrant: async (id: string, updates: Partial<Migrant>): Promise<Migrant> => {
    const setClause = Object.keys(updates)
      .filter(key => key !== 'id' && updates[key as keyof Migrant] !== undefined)
      .map(key => `"${key}" = $${Object.keys(updates).indexOf(key) + 1}`)
      .join(', ');
    
    const values = Object.values(updates).filter(value => value !== undefined);
    
    const result = await sql`
      UPDATE "Migrant" 
      SET ${sql.unsafe(setClause)}
      WHERE "id" = ${id}
      RETURNING *
    `;
    return result.rows[0] as Migrant;
  },

  // Health Record operations
  getHealthRecords: async (): Promise<HealthRecord[]> => {
    const result = await sql`
      SELECT hr.*, m.name as migrant_name, d.name as doctor_name, p.name as poc_name
      FROM "HealthRecord" hr
      LEFT JOIN "Migrant" m ON hr."migrantId" = m.id
      LEFT JOIN "Doctor" d ON hr."doctorId" = d.id
      LEFT JOIN "POC" p ON hr."pocId" = p.id
      ORDER BY hr."createdAt" DESC
    `;
    return result.rows as HealthRecord[];
  },

  createHealthRecord: async (recordData: Omit<HealthRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<HealthRecord> => {
    const result = await sql`
      INSERT INTO "HealthRecord" ("id", "migrantId", "pocId", "doctorId", "symptoms", "diagnosis", "prescription", "isNotifiable", "updatedAt")
      VALUES (gen_random_uuid(), ${recordData.migrantId}, ${recordData.pocId}, ${recordData.doctorId}, ${recordData.symptoms}, ${recordData.diagnosis}, ${recordData.prescription}, ${recordData.isNotifiable}, NOW())
      RETURNING *
    `;
    return result.rows[0] as HealthRecord;
  },

  // Doctor operations
  getDoctors: async (): Promise<Doctor[]> => {
    const result = await sql`SELECT * FROM "Doctor"`;
    return result.rows as Doctor[];
  },

  createDoctor: async (doctorData: Omit<Doctor, 'id'>): Promise<Doctor> => {
    const result = await sql`
      INSERT INTO "Doctor" ("id", "hospitalId", "name")
      VALUES (gen_random_uuid(), ${doctorData.hospitalId}, ${doctorData.name})
      RETURNING *
    `;
    return result.rows[0] as Doctor;
  },

  // POC operations
  getPOCs: async (): Promise<POC[]> => {
    const result = await sql`SELECT * FROM "POC"`;
    return result.rows as POC[];
  },

  createPOC: async (pocData: Omit<POC, 'id'>): Promise<POC> => {
    const result = await sql`
      INSERT INTO "POC" ("id", "pocId", "name")
      VALUES (gen_random_uuid(), ${pocData.pocId}, ${pocData.name})
      RETURNING *
    `;
    return result.rows[0] as POC;
  },

  // Analytics and reporting
  getMigrantStats: async () => {
    const result = await sql`
      SELECT 
        COUNT(*) as total_migrants,
        COUNT(CASE WHEN "gender" = 'Male' THEN 1 END) as male_count,
        COUNT(CASE WHEN "gender" = 'Female' THEN 1 END) as female_count,
        COUNT(CASE WHEN "pocId" IS NOT NULL THEN 1 END) as with_poc_count
      FROM "Migrant"
    `;
    return result.rows[0];
  },

  getHealthRecordStats: async () => {
    const result = await sql`
      SELECT 
        COUNT(*) as total_records,
        COUNT(CASE WHEN "isNotifiable" = true THEN 1 END) as notifiable_count,
        COUNT(CASE WHEN "diagnosis" IS NOT NULL THEN 1 END) as diagnosed_count
      FROM "HealthRecord"
    `;
    return result.rows[0];
  }
};

// Legacy API for backward compatibility
export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

export const userAPI = {
  getUsers: () => api.get<User[]>('/users'),
  createUser: (userData: Omit<User, 'id' | 'created_at'>) => 
    api.post<User>('/users', userData),
  deleteUser: (id: number) => api.delete(`/users/${id}`),
};