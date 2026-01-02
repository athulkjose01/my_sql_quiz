const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || 'An error occurred');
  }
  return data;
};

export const authApi = {
  register: async (email, password, name) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    return handleResponse(response);
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  adminLogin: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },
};

export const questionsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/questions`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (question) => {
    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(question),
    });
    return handleResponse(response);
  },

  update: async (id, question) => {
    const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(question),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.message || 'An error occurred');
    }
    return true;
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.message || 'An error occurred');
    }
    return true;
  },
};

export const quizApi = {
  submit: async (answers, timeTaken) => {
    const response = await fetch(`${API_BASE_URL}/quiz/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ answers, timeTaken }),
    });
    return handleResponse(response);
  },

  getHistory: async () => {
    const response = await fetch(`${API_BASE_URL}/quiz/history`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getResult: async (id) => {
    const response = await fetch(`${API_BASE_URL}/quiz/result/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

export const adminApi = {
  getReports: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/reports`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};
