import { useCallback, useEffect, useState } from 'react';
import { Alert, Box, Container, Stack, Typography } from '@mui/material';
import {
  createWorkLog,
  deleteWorkLog,
  getApiErrorMessage,
  getWorkLogs,
  getWorkTypes,
  updateWorkLog,
  type WorkLog,
  type WorkLogFilters,
  type WorkLogPayload,
  type WorkType,
} from '../api';
import { WorkLogFilters as WorkLogFiltersForm } from './WorkLogFilters';
import { WorkLogForm } from './WorkLogForm';
import { WorkLogTable } from './WorkLogTable';

const getDefaultForm = (workTypeId = 0): WorkLogPayload => ({
  workDate: new Date().toISOString().slice(0, 10),
  workTypeId,
  volume: 0,
  unit: 'м³',
  performerName: '',
  comment: '',
});

const normalizeFilters = (filters: WorkLogFilters): WorkLogFilters => ({
  from: filters.from || undefined,
  to: filters.to || undefined,
});

export function WorkLogPage() {
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [form, setForm] = useState<WorkLogPayload>(() => getDefaultForm());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filters, setFilters] = useState<WorkLogFilters>({});
  const [appliedFilters, setAppliedFilters] = useState<WorkLogFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (nextFilters: WorkLogFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const [types, logs] = await Promise.all([
        getWorkTypes(),
        getWorkLogs(normalizeFilters(nextFilters)),
      ]);

      setWorkTypes(types);
      setWorkLogs(logs);
      setForm((previous) =>
        previous.workTypeId || !types[0]
          ? previous
          : { ...previous, workTypeId: types[0].id },
      );
    } catch (currentError) {
      setError(getApiErrorMessage(currentError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData(appliedFilters);
  }, [appliedFilters, loadData]);

  const resetForm = () => {
    setEditingId(null);
    setForm(getDefaultForm(workTypes[0]?.id ?? 0));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: WorkLogPayload = {
        ...form,
        comment: form.comment?.trim() || undefined,
        performerName: form.performerName.trim(),
        unit: form.unit.trim(),
      };

      if (editingId) {
        await updateWorkLog(editingId, payload);
      } else {
        await createWorkLog(payload);
      }

      resetForm();
      await loadData(appliedFilters);
    } catch (currentError) {
      setError(getApiErrorMessage(currentError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: WorkLog) => {
    setEditingId(item.id);
    setForm({
      workDate: item.workDate.slice(0, 10),
      workTypeId: item.workTypeId,
      volume: item.volume,
      unit: item.unit,
      performerName: item.performerName,
      comment: item.comment ?? '',
    });
  };

  const handleDelete = async (id: number) => {
    const shouldDelete = window.confirm('Удалить запись журнала?');

    if (!shouldDelete) {
      return;
    }

    setError(null);

    try {
      await deleteWorkLog(id);
      await loadData(appliedFilters);
    } catch (currentError) {
      setError(getApiErrorMessage(currentError));
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Box>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 800 }}>
              Журнал работ на строительном объекте
            </Typography>
            <Typography color="text.secondary">
              Учёт выполненных работ по датам, видам работ, исполнителям и
              объёмам.
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <WorkLogForm
            form={form}
            workTypes={workTypes}
            isEditing={editingId !== null}
            isSubmitting={isSubmitting}
            onChange={(patch) =>
              setForm((previous) => ({ ...previous, ...patch }))
            }
            onSubmit={handleSubmit}
            onCancelEdit={resetForm}
          />

          <WorkLogFiltersForm
            filters={filters}
            isLoading={isLoading}
            onChange={setFilters}
            onApply={() => setAppliedFilters(filters)}
            onReset={() => {
              setFilters({});
              setAppliedFilters({});
            }}
          />

          <WorkLogTable
            workLogs={workLogs}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Stack>
      </Container>
    </Box>
  );
}
