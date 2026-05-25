import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import type { WorkLogFilters as WorkLogFilterValues } from '../api';
import { DateInput } from './DateInput';

type WorkLogFiltersProps = {
  filters: WorkLogFilterValues;
  isLoading: boolean;
  onChange: (filters: WorkLogFilterValues) => void;
  onApply: () => void;
  onReset: () => void;
};

export function WorkLogFilters({
  filters,
  isLoading,
  onChange,
  onApply,
  onReset,
}: WorkLogFiltersProps) {
  const hasFilters = Boolean(filters.from || filters.to);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography
          component="h2"
          variant="h6"
          sx={{ fontWeight: 700, mb: 2 }}
        >
          Фильтр по дате
        </Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <DateInput
            label="С"
            value={filters.from ?? ''}
            onChange={(from) => onChange({ ...filters, from })}
            disabled={isLoading}
          />
          <DateInput
            label="По"
            value={filters.to ?? ''}
            onChange={(to) => onChange({ ...filters, to })}
            disabled={isLoading}
          />
          <Button
            variant="outlined"
            onClick={onApply}
            disabled={isLoading}
            sx={{ minWidth: 130 }}
          >
            Применить
          </Button>
          <Button disabled={!hasFilters || isLoading} onClick={onReset}>
            Сбросить
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
