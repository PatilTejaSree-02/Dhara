// src/lib/db-test-api.ts
const API_BASE = import.meta.env.PROD ? '/api' : 'https://your-app-name.vercel.app/api';

export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

export const dbTestAPI = {
  // Initialize database (create table)
  async initializeDB(): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE}/init-db`, {
        method: 'POST',
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to initialize database. This will work when deployed to Vercel.');
    }
  },

  // Get all users
  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE}/users`);
      return await response.json();
    } catch (error) {
      // Return mock data for local development
      return [
        { id: 1, name: 'Local Test User', email: 'local@test.com', created_at: new Date().toISOString() },
        { id: 2, name: 'Demo User', email: 'demo@test.com', created_at: new Date().toISOString() }
      ];
    }
  },

  // Add a user
  async addUser(user: Omit<User, 'id'>): Promise<User> {
    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      return await response.json();
    } catch (error) {
      // Mock response for local development
      return { id: Date.now(), ...user, created_at: new Date().toISOString() };
    }
  },

  // Delete a user
  async deleteUser(id: number): Promise<void> {
    try {
      await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.log('Delete would work on Vercel');
      // Silently fail for local development
    }
  }
};