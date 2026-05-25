import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { WorkLogPage } from './components/WorkLogPage';

const theme = createTheme({
  palette: {
    background: {
      default: '#f4f7fb',
      paper: '#ffffff',
    },
    primary: {
      main: '#2563eb',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WorkLogPage />
    </ThemeProvider>
  );
}

export default App;
