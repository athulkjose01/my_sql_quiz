import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { questionsApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadQuestions();
  }, []);

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

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const resetForm = () => {
    setFormData({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    });
    setEditingQuestion(null);
    setError('');
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (question) => {
    setEditingQuestion(question);
    setFormData({
      questionText: question.questionText,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
    });
    setDialogOpen(true);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        questionText: formData.questionText,
        options: formData.options,
        correctAnswer: formData.correctAnswer,
      };

      if (editingQuestion) {
        await questionsApi.update(editingQuestion.id, payload);
      } else {
        await questionsApi.create(payload);
      }

      setDialogOpen(false);
      resetForm();
      await loadQuestions();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await questionsApi.delete(id);
      await loadQuestions();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Manage Questions</h1>
            <p className="text-gray-600">Add, edit, or delete quiz questions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/admin/reports">View Reports</Link>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Questions ({questions.length})</CardTitle>
              <CardDescription>Manage your quiz questions</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddDialog}>Add Question</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>
                      {editingQuestion ? 'Edit Question' : 'Add New Question'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingQuestion
                        ? 'Update the question details below'
                        : 'Fill in the question details below'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {error && (
                      <div className="p-3 text-sm border border-black bg-gray-100">
                        {error}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="questionText">Question</Label>
                      <Textarea
                        id="questionText"
                        placeholder="Enter the question"
                        value={formData.questionText}
                        onChange={(e) =>
                          setFormData({ ...formData, questionText: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Options</Label>
                      {formData.options.map((option, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            required
                          />
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={formData.correctAnswer === index}
                            onChange={() =>
                              setFormData({ ...formData, correctAnswer: index })
                            }
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-gray-600">Correct</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? 'Saving...' : editingQuestion ? 'Update' : 'Add'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8">Loading...</p>
            ) : questions.length === 0 ? (
              <p className="text-center py-8 text-gray-600">No questions found</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead className="w-32">Options</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question, index) => (
                    <TableRow key={question.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="max-w-md truncate">
                        {question.questionText}
                      </TableCell>
                      <TableCell>{question.options.length} options</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(question)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(question.id)}
                          >
                            Delete
                          </Button>
                        </div>
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
