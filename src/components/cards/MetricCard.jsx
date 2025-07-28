import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Chip,
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const formatValue = (value, format) => {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('es-GT', {
        style: 'currency',
        currency: 'GTQ',
      }).format(value);
    case 'percentage':
      return `${value}%`;
    case 'number':
      return new Intl.NumberFormat('es-GT').format(value);
    default:
      return value;
  }
};

export default function MetricCard({
  title,
  value,
  format = 'number',
  icon,
  trend,
  loading = false,
  color = 'primary',
}) {
  const getTrendColor = (trendValue) => {
    if (!trendValue) return 'default';
    return trendValue > 0 ? 'success' : 'error';
  };

  const getTrendIcon = (trendValue) => {
    if (!trendValue) return null;
    return trendValue > 0 ? <TrendingUp /> : <TrendingDown />;
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => theme.shadows[8],
        },
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            justifyContent: 'space-between',
            mb: 2 
          }}
        >
          <Box>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ fontWeight: 500 }}
            >
              {title}
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  color: `${color}.main`,
                  mt: 1 
                }}
              >
                {formatValue(value, format)}
              </Typography>
            )}
          </Box>
          
          <Box
            sx={{
              p: 1.5,
              borderRadius: '50%',
              backgroundColor: `${color}.main`,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
            }}
          >
            {icon}
          </Box>
        </Box>

        {trend !== undefined && trend !== null && !loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={getTrendIcon(trend)}
              label={`${trend > 0 ? '+' : ''}${trend}%`}
              size="small"
              color={getTrendColor(trend)}
              variant="outlined"
              sx={{ 
                fontSize: '0.75rem',
                height: 24,
                '& .MuiChip-icon': {
                  fontSize: '1rem',
                },
              }}
            />
            <Typography variant="caption" color="text.secondary">
              vs. período anterior
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}