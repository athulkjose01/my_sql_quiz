import { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { quizApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function QuizResult() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!location.state?.result);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!result) {
      loadResult();
    }
  }, [id]);

  const loadResult = async () => {
    try {
      const data = await quizApi.getResult(id);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading result...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || 'Result not found'}</p>
          </CardContent>
          <CardContent>
            <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Quiz Result</h1>
          <Button variant="outline" asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Score</CardDescription>
              <CardTitle className="text-3xl">
                {result.score}/{result.totalQuestions}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Correct Answers</CardDescription>
              <CardTitle className="text-3xl">{result.correctAnswers}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Wrong Answers</CardDescription>
              <CardTitle className="text-3xl">{result.wrongAnswers}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Time Taken</CardDescription>
              <CardTitle className="text-3xl">{formatTime(result.timeTaken)}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Percentage</span>
                <span className="font-bold">{result.percentage}%</span>
              </div>
              <Progress value={result.percentage} />
            </div>
          </CardContent>
        </Card>

        {result.answerResults && result.answerResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Question Review</CardTitle>
              <CardDescription>Review your answers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {result.answerResults.map((answer, index) => (
                <div
                  key={answer.questionId}
                  className={`p-4 border rounded-lg ${
                    answer.isCorrect ? 'border-gray-300 bg-gray-50' : 'border-black bg-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-3">
                    <span className="font-bold">{index + 1}.</span>
                    <span className="flex-1">{answer.questionText}</span>
                    <span className={`text-sm font-medium ${answer.isCorrect ? '' : ''}`}>
                      {answer.isCorrect ? 'Correct' : 'Wrong'}
                    </span>
                  </div>
                  <div className="space-y-2 ml-6">
                    {answer.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-2 rounded text-sm ${
                          optIndex === answer.correctAnswer
                            ? 'bg-white border-2 border-black font-medium'
                            : optIndex === answer.selectedAnswer && !answer.isCorrect
                            ? 'bg-gray-200 border border-gray-400'
                            : ''
                        }`}
                      >
                        {option}
                        {optIndex === answer.correctAnswer && (
                          <span className="ml-2 text-xs">(Correct Answer)</span>
                        )}
                        {optIndex === answer.selectedAnswer && optIndex !== answer.correctAnswer && (
                          <span className="ml-2 text-xs">(Your Answer)</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="mt-8 flex gap-4 justify-center">
          <Button asChild>
            <Link to="/quiz">Try Again</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
