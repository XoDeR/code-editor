import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface Code {
  id: string;
  title: string;
  language: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  sharedId?: string;
  isPublic: boolean;
}

// API
export const getSharedCode = async (sharedId: string): Promise<Code> => {
  const response = await api.get(`/shared/${sharedId}`);
  return response.data;
};

// Authenticated API
export const saveCode = async (code: Omit<Code, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'sharedId' | 'isPublic'>, token: string): Promise<Code> => {
  const response = await api.post('/codes', code, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateCode = async (
  id: string,
  code: Partial<Code>,
  token: string
): Promise<{ count: number }> => {
  const res = await api.put(`/codes/${id}`, code, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteCode = async (id: string, token: string): Promise<void> => {
  await api.delete(`/codes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const shareCode = async (id: string, token: string): Promise<{ sharedId: string }> => {
  const response = await api.post(`/codes/share/${id}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const downloadCode = async (
  id: string,
  token: string
): Promise<{ blob: Blob; fileName: string }> => {
  const response = await api.get(`/codes/download/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob"
  });

  const contentDisposition = response.headers["content-disposition"];
  let fileName = "code.txt";

  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/);
    if (match && match[1]) {
      fileName = match[1]; // Includes extension: "hello.js"
    }
  }

  return { blob: response.data, fileName };
};

export const getUserCodes = async (token: string): Promise<Code[]> => {
  const response = await api.get('/codes', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};