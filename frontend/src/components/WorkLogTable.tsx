import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type { WorkLog } from '../api';

type WorkLogTableProps = {
  workLogs: WorkLog[];
  isLoading: boolean;
  onEdit: (item: WorkLog) => void;
  onDelete: (id: number) => void;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU').format(new Date(value));

const formatVolume = (item: WorkLog) =>
  `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(
    item.volume,
  )} ${item.unit}`;

export function WorkLogTable({
  workLogs,
  isLoading,
  onEdit,
  onDelete,
}: WorkLogTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ justifyContent: 'space-between', mb: 2 }}
        >
          <Box>
            <Typography component="h2" variant="h5" sx={{ fontWeight: 700 }}>
              Записи журнала
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {workLogs.length
                ? `Всего записей: ${workLogs.length}`
                : 'Записи появятся здесь после добавления.'}
            </Typography>
          </Box>
          {isLoading && <Chip label="Загрузка..." size="small" />}
        </Stack>

        {!workLogs.length ? (
          <Box
            sx={{
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
            }}
          >
            <Typography sx={{ fontWeight: 700 }}>Записей пока нет</Typography>
            <Typography color="text.secondary" variant="body2">
              Добавьте первую запись или измените фильтр по дате.
            </Typography>
          </Box>
        ) : isMobile ? (
          <Stack spacing={1.5}>
            {workLogs.map((item) => (
              <Card key={item.id} variant="outlined">
                <CardContent>
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>
                        {item.workType.name}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        {formatDate(item.workDate)}
                      </Typography>
                    </Box>
                    <Typography>{formatVolume(item)}</Typography>
                    <Typography>{item.performerName}</Typography>
                    {item.comment && (
                      <Typography color="text.secondary" variant="body2">
                        {item.comment}
                      </Typography>
                    )}
                    <Stack direction="row" spacing={1}>
                      <Button size="small" onClick={() => onEdit(item)}>
                        Изменить
                      </Button>
                      <Button
                        color="error"
                        size="small"
                        onClick={() => onDelete(item.id)}
                      >
                        Удалить
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Дата</TableCell>
                  <TableCell>Вид работ</TableCell>
                  <TableCell align="right">Объём</TableCell>
                  <TableCell>Исполнитель</TableCell>
                  <TableCell>Комментарий</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workLogs.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{formatDate(item.workDate)}</TableCell>
                    <TableCell>{item.workType.name}</TableCell>
                    <TableCell align="right">{formatVolume(item)}</TableCell>
                    <TableCell>{item.performerName}</TableCell>
                    <TableCell>{item.comment || '-'}</TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ justifyContent: 'flex-end' }}
                      >
                        <Button size="small" onClick={() => onEdit(item)}>
                          Изменить
                        </Button>
                        <Button
                          color="error"
                          size="small"
                          onClick={() => onDelete(item.id)}
                        >
                          Удалить
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}
