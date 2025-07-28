import { BrowserRouter, Routes, Route } from 'react-router';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from './theme/theme';
import Layout from './components/common/Layout';

// Importar páginas
import Dashboard from './pages/Dashboard/Dashboard';
import Productos from './pages/Productos/Productos';
import Ventas from './pages/Ventas/Ventas';
import Combos from './pages/Combos/Combos';
import Inventario from './pages/Inventario/Inventario';
import IA from './pages/IA/IA';
import Sucursales from './pages/Sucursales/Sucursales';
// import Configuracion from './pages/Configuracion/Configuracion';

// Crear cliente de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="productos" element={<Productos />} />
              <Route path="ventas" element={<Ventas />} />
              <Route path="combos" element={<Combos />} />
              <Route path="inventario" element={<Inventario />} />
              <Route path="ia" element={<IA />} />
              <Route path="sucursales" element={<Sucursales />} />
              {/* <Route path="configuracion" element={<Configuracion />} /> */}
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;