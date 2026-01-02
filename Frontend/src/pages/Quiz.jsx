import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionsApi, quizApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);

  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    loadQuestions();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (questions.length > 0 && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
  }, [questions]);

  const loadQuestions = async () => {
    try {
      const data = await questionsApi.getAll();
      setQuestions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setSubmitting(true);
    setError('');

    try {
      const answerList = questions.map((q) => ({
        questionId: q.id,
        selectedAnswer: answers[q.id] ?? -1,
      }));

      const result = await quizApi.submit(answerList, timeElapsed);
      navigate(`/quiz/result/${result.id}`, { state: { result } });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading questions...</p>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Questions Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p>There are no questions available at the moment.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Quiz Assessment</h1>
            <p className="text-gray-600">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-mono">{formatTime(timeElapsed)}</p>
            <p className="text-sm text-gray-600">Time Elapsed</p>
          </div>
        </div>

        <Progress value={progress} className="mb-6" />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{currentQuestion.questionText}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQuestion.id]?.toString() || ''}
              onValueChange={(value) => handleAnswerSelect(currentQuestion.id, parseInt(value))}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-md mb-2 hover:bg-gray-50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {error && (
          <div className="p-3 text-sm border border-black bg-gray-100 mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>

          <p className="text-sm text-gray-600">
            {answeredCount} of {questions.length} answered
          </p>

          {currentIndex === questions.length - 1 ? (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-600 mb-2">Question Navigation:</p>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, index) => (
              <Button
                key={q.id}
                variant={answers[q.id] !== undefined ? 'default' : 'outline'}
                size="sm"
                className={currentIndex === index ? 'ring-2 ring-black' : ''}
                onClick={() => setCurrentIndex(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
