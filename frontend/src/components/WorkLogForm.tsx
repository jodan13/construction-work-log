import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { WorkLogPayload, WorkType } from '../api';
import { DateInput } from './DateInput';

type WorkLogFormProps = {
  form: WorkLogPayload;
  workTypes: WorkType[];
  isEditing: boolean;
  isSubmitting: boolean;
  onChange: (patch: Partial<WorkLogPayload>) => void;
  onSubmit: () => void;
  onCancelEdit: () => void;
};

export function WorkLogForm({
  form,
  workTypes,
  isEditing,
  isSubmitting,
  onChange,
  onSubmit,
  onCancelEdit,
}: WorkLogFormProps) {
  const canSubmit =
    Boolean(form.workDate) &&
    form.workTypeId > 0 &&
    form.volume > 0 &&
    form.unit.trim().length > 0 &&
    form.performerName.trim().length >= 2;

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography component="h2" variant="h5" sx={{ fontWeight: 700 }}>
            {isEditing ? 'Редактирование записи' : 'Добавление записи'}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Заполните дату, вид работ, объём и исполнителя.
          </Typography>
        </Box>

        <Stack spacing={2.5}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <DateInput
              label="Дата выполнения"
              value={form.workDate}
              onChange={(workDate) => onChange({ workDate })}
              disabled={isSubmitting}
            />

            <TextField
              label="Вид работ"
              select
              value={form.workTypeId || ''}
              onChange={(event) =>
                onChange({ workTypeId: Number(event.target.value) })
              }
              disabled={isSubmitting || workTypes.length === 0}
              fullWidth
            >
              {workTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Объём"
              type="number"
              value={form.volume}
              onChange={(event) =>
                onChange({ volume: Number(event.target.value) })
              }
              disabled={isSubmitting}
              fullWidth
              slotProps={{
                htmlInput: { min: 0, step: 0.01 },
              }}
            />

            <TextField
              label="Единица измерения"
              value={form.unit}
              onChange={(event) => onChange({ unit: event.target.value })}
              disabled={isSubmitting}
              fullWidth
            />

            <TextField
              label="ФИО исполнителя"
              value={form.performerName}
              onChange={(event) =>
                onChange({ performerName: event.target.value })
              }
              disabled={isSubmitting}
              fullWidth
            />
          </Stack>

          <TextField
            label="Комментарий"
            value={form.comment ?? ''}
            onChange={(event) => onChange({ comment: event.target.value })}
            disabled={isSubmitting}
            fullWidth
            multiline
            minRows={2}
          />

          <Stack
            direction="row"
            spacing={1.5}
            useFlexGap
            sx={{ flexWrap: 'wrap' }}
          >
            <Button
              variant="contained"
              disabled={!canSubmit || isSubmitting}
              onClick={onSubmit}
            >
              {isEditing ? 'Сохранить' : 'Добавить'}
            </Button>

            {isEditing && (
              <Button
                variant="outlined"
                disabled={isSubmitting}
                onClick={onCancelEdit}
              >
                Отмена
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
