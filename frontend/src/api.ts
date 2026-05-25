import axios from 'axios';

export type WorkType = {
  id: number;
  name: string;
};

export type WorkLog = {
  id: number;
  workDate: string;
  volume: number;
  unit: string;
  performerName: string;
  comment?: string | null;
  workTypeId: number;
  workType: WorkType;
};

export type WorkLogPayload = {
  workDate: string;
  workTypeId: number;
  volume: number;
  unit: string;
  performerName: string;
  comment?: string;
};

export type WorkLogFilters = {
  from?: string;
  to?: string;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
});

export const getWorkTypes = async () => {
  const { data } = await api.get<WorkType[]>('/work-types');
  return data;
};

export const getWorkLogs = async (params?: WorkLogFilters) => {
  const { data } = await api.get<WorkLog[]>('/work-logs', { params });
  return data;
};

export const createWorkLog = async (payload: WorkLogPayload) => {
  const { data } = await api.post<WorkLog>('/work-logs', payload);
  return data;
};

export const updateWorkLog = async (id: number, payload: WorkLogPayload) => {
  const { data } = await api.patch<WorkLog>(`/work-logs/${id}`, payload);
  return data;
};

export const deleteWorkLog = async (id: number) => {
  await api.delete(`/work-logs/${id}`);
};

export const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(', ');
    }

    if (typeof message === 'string') {
      return message;
    }

    if (error.response?.status === 404) {
      return 'Запись не найдена.';
    }
  }

  return 'Не удалось выполнить запрос. Проверьте backend и подключение к базе.';
};
