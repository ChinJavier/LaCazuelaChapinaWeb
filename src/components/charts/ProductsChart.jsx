import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Circle } from '@mui/icons-material';

const COLORS = ['#8B4513', '#228B22', '#4682B4', '#FF8C00', '#DC143C'];

export default function ProductsChart({ data, height = 300 }) {
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

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
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
            {data.name}
          </Typography>
          <Typography variant="body2">
            Vendidos: {data.value}
          </Typography>
          <Typography variant="body2">
            Porcentaje: {((data.value / data.total) * 100).toFixed(1)}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Calcular el total para los porcentajes
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = data.map(item => ({ ...item, total }));

  return (
    <Box sx={{ height, minWidth: 300 }}>
      <Box sx={{ height: height * 0.7 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={dataWithTotal}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {dataWithTotal.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      
      <List dense sx={{ pt: 0 }}>
        {dataWithTotal.slice(0, 3).map((item, index) => (
          <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
            <ListItemIcon sx={{ minWidth: 24 }}>
              <Circle 
                sx={{ 
                  fontSize: 12, 
                  color: COLORS[index % COLORS.length] 
                }} 
              />
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" noWrap>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.value}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}