import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, CheckCircle, XCircle, Database, Users, FileText, UserCheck } from 'lucide-react';
import { databaseAPI } from '../lib/api';

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
  const [migrants, setMigrants] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [pocs, setPOCs] = useState([]);

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
      const response = await fetch('/api/init-db', { method: 'POST' });
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

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Database Connection Test</h1>
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
    </div>
  );
}
