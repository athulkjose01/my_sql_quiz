import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { adminApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reportsData, statsData] = await Promise.all([
        adminApi.getReports(),
        adminApi.getStats(),
      ]);
      setReports(reportsData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Reports & Statistics</h1>
            <p className="text-gray-600">View all user quiz attempts and statistics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/admin/questions">Manage Questions</Link>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-8">Loading...</p>
        ) : (
          <>
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Users</CardDescription>
                    <CardTitle className="text-3xl">{stats.totalUsers}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Questions</CardDescription>
                    <CardTitle className="text-3xl">{stats.totalQuestions}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Attempts</CardDescription>
                    <CardTitle className="text-3xl">{stats.totalAttempts}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Average Score</CardDescription>
                    <CardTitle className="text-3xl">{stats.averageScore}%</CardTitle>
                  </CardHeader>
                </Card>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>All Quiz Attempts</CardTitle>
                <CardDescription>View detailed reports of all user attempts</CardDescription>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <p className="text-center py-8 text-gray-600">No quiz attempts yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Correct</TableHead>
                        <TableHead>Wrong</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>{report.userName || 'N/A'}</TableCell>
                          <TableCell>{report.userEmail || 'N/A'}</TableCell>
                          <TableCell>{formatDate(report.completedAt)}</TableCell>
                          <TableCell>
                            {report.score}/{report.totalQuestions}
                          </TableCell>
                          <TableCell>{report.correctAnswers}</TableCell>
                          <TableCell>{report.wrongAnswers}</TableCell>
                          <TableCell>{report.percentage}%</TableCell>
                          <TableCell>{formatTime(report.timeTaken)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
