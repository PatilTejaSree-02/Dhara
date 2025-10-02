// src/pages/DatabaseTest.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2, CheckCircle, XCircle, Database, Users, FileText, UserCheck, Plus, Trash2 } from 'lucide-react';
import { databaseAPI, Migrant, HealthRecord, Doctor, POC } from '../lib/api';

interface HealthStatus {
  status: string;
  timestamp?: string;
  postgresVersion?: string;
  stats?: {
    migrants: number;
    healthRecords: number;
    doctors: number;
    pocs: number;
  };
  error?: string;
}

export default function DatabaseTest() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [migrants, setMigrants] = useState<Migrant[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pocs, setPOCs] = useState<POC[]>([]);
  const [newMigrant, setNewMigrant] = useState({
    athidhiId: '',
    phoneNumber: '',
    name: '',
    gender: '',
    address: ''
  });

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealthStatus(data);
    } catch (error) {
      setHealthStatus({
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [migrantsData, healthRecordsData, doctorsData, pocsData] = await Promise.all([
        databaseAPI.getMigrants(),
        databaseAPI.getHealthRecords(),
        databaseAPI.getDoctors(),
        databaseAPI.getPOCs()
      ]);

      setMigrants(migrantsData);
      setHealthRecords(healthRecordsData);
      setDoctors(doctorsData);
      setPOCs(pocsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/setup-your-database', { method: 'POST' });
      const data = await response.json();
      
      if (response.ok) {
        alert('Database initialized successfully!');
        await checkHealth();
        await loadData();
      } else {
        alert(`Database initialization failed: ${data.message}`);
      }
    } catch (error) {
      alert(`Database initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const addMigrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMigrant.athidhiId || !newMigrant.phoneNumber || !newMigrant.name) return;

    try {
      await databaseAPI.createMigrant({
        ...newMigrant,
        pocId: pocs[0]?.id // Use first POC if available
      });
      setNewMigrant({ athidhiId: '', phoneNumber: '', name: '', gender: '', address: '' });
      await loadData();
    } catch (error) {
      console.error('Failed to add migrant:', error);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Migrant Health Database Test</h1>
        <div className="flex gap-2">
          <Button onClick={checkHealth} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Check Health'}
          </Button>
          <Button onClick={loadData} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load Data'}
          </Button>
          <Button onClick={initializeDatabase} disabled={loading} variant="outline">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Initialize DB'}
          </Button>
        </div>
      </div>

      {/* Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Health Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {healthStatus ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {healthStatus.status === 'healthy' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <Badge variant={healthStatus.status === 'healthy' ? 'default' : 'destructive'}>
                  {healthStatus.status}
                </Badge>
              </div>
              
              {healthStatus.timestamp && (
                <p className="text-sm text-muted-foreground">
                  Last checked: {new Date(healthStatus.timestamp).toLocaleString()}
                </p>
              )}
              
              {healthStatus.postgresVersion && (
                <p className="text-sm text-muted-foreground">
                  PostgreSQL: {healthStatus.postgresVersion}
                </p>
              )}

              {healthStatus.stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Migrants: {healthStatus.stats.migrants}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">Health Records: {healthStatus.stats.healthRecords}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    <span className="text-sm">Doctors: {healthStatus.stats.doctors}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    <span className="text-sm">POCs: {healthStatus.stats.pocs}</span>
                  </div>
                </div>
              )}

              {healthStatus.error && (
                <Alert variant="destructive">
                  <AlertDescription>{healthStatus.error}</AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <p>Click "Check Health" to test database connection</p>
          )}
        </CardContent>
      </Card>

      {/* Add New Migrant */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Migrant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addMigrant} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Athidhi ID"
              value={newMigrant.athidhiId}
              onChange={(e) => setNewMigrant({...newMigrant, athidhiId: e.target.value})}
              className="p-2 border rounded"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={newMigrant.phoneNumber}
              onChange={(e) => setNewMigrant({...newMigrant, phoneNumber: e.target.value})}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Full Name"
              value={newMigrant.name}
              onChange={(e) => setNewMigrant({...newMigrant, name: e.target.value})}
              className="p-2 border rounded"
              required
            />
            <select
              value={newMigrant.gender}
              onChange={(e) => setNewMigrant({...newMigrant, gender: e.target.value})}
              className="p-2 border rounded"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              placeholder="Address"
              value={newMigrant.address}
              onChange={(e) => setNewMigrant({...newMigrant, address: e.target.value})}
              className="p-2 border rounded md:col-span-2"
            />
            <Button type="submit" className="md:col-span-2">
              Add Migrant
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Data Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Migrants ({migrants.length})</CardTitle>
            <CardDescription>Registered migrant workers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {migrants.map((migrant) => (
                <div key={migrant.id} className="p-2 border rounded">
                  <p className="font-medium">{migrant.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {migrant.athidhiId} • {migrant.phoneNumber}
                  </p>
                  {migrant.gender && (
                    <p className="text-xs text-muted-foreground">Gender: {migrant.gender}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Records ({healthRecords.length})</CardTitle>
            <CardDescription>Medical records and consultations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {healthRecords.map((record) => (
                <div key={record.id} className="p-2 border rounded">
                  <p className="font-medium">{record.symptoms}</p>
                  <p className="text-sm text-muted-foreground">
                    {record.diagnosis ? `Diagnosis: ${record.diagnosis}` : 'No diagnosis yet'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(record.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{doctors.length}</p>
            <p className="text-sm text-muted-foreground">Registered doctors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">POCs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pocs.length}</p>
            <p className="text-sm text-muted-foreground">Points of care</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{healthRecords.length}</p>
            <p className="text-sm text-muted-foreground">Health records</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}