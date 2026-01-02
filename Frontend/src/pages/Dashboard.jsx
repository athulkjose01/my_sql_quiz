import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { quizApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await quizApi.getHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/quiz">Attempt Assessment</Link>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quiz History</CardTitle>
            <CardDescription>Your past quiz attempts and results</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8">Loading...</p>
            ) : history.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">You haven't attempted any quizzes yet.</p>
                <Button asChild>
                  <Link to="/quiz">Start Your First Quiz</Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Correct</TableHead>
                    <TableHead>Wrong</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Time Taken</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell>{formatDate(attempt.completedAt)}</TableCell>
                      <TableCell>{attempt.score}/{attempt.totalQuestions}</TableCell>
                      <TableCell>{attempt.correctAnswers}</TableCell>
                      <TableCell>{attempt.wrongAnswers}</TableCell>
                      <TableCell>{attempt.percentage}%</TableCell>
                      <TableCell>{formatTime(attempt.timeTaken)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/quiz/result/${attempt.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
