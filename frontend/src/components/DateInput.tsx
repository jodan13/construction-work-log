import { TextField } from '@mui/material';

type DateInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function DateInput({ label, value, onChange, disabled }: DateInputProps) {
  return (
    <TextField
      label={label}
      type="date"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      fullWidth
      slotProps={{
        inputLabel: { shrink: true },
      }}
      sx={{
        '& input[type="date"]': {
          minHeight: 24,
        },
        '& input[type="date"]::-webkit-datetime-edit': {
          color: value ? 'inherit' : 'text.secondary',
        },
      }}
    />
  );
}
