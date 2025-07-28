import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function HourlyChart({ data, height = 300 }) {
  const theme = useTheme();

  if (!data || data.length === 0) {
    return (
      <Box 
        sx={{ 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <Typography color="text.secondary">
          No hay datos disponibles
        </Typography>
      </Box>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: 2,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {label}:00
          </Typography>
          {payload.map((entry, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color }}
            >
              {entry.name}: Q{entry.value?.toLocaleString()}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme.palette.divider}
          />
          <XAxis 
            dataKey="hora"
            tick={{ fontSize: 12 }}
            stroke={theme.palette.text.secondary}
            tickFormatter={(value) => `${value}:00`}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke={theme.palette.text.secondary}
            tickFormatter={(value) => `Q${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="ventas" 
            stroke={theme.palette.primary.main}
            strokeWidth={3}
            dot={{ 
              fill: theme.palette.primary.main, 
              strokeWidth: 2,
              r: 4 
            }}
            activeDot={{ 
              r: 6, 
              stroke: theme.palette.primary.main,
              strokeWidth: 2,
              fill: theme.palette.primary.light
            }}
            name="Ventas"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}