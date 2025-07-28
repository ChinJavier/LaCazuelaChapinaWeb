import {
  Box,
  Avatar,
  Typography,
  Paper,
  Button,
  Chip,
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  Person as PersonIcon,
  ContentCopy as CopyIcon,
  VolumeUp as VolumeUpIcon,
} from '@mui/icons-material';

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('es-GT', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function ChatMessage({ message }) {
  const isUser = message.type === 'user';
  const isError = message.isError;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.lang = 'es-ES';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        gap: 2,
        mb: 3,
        alignItems: 'flex-start',
      }}
    >
      <Avatar
        sx={{
          bgcolor: isUser ? 'secondary.main' : isError ? 'error.main' : 'primary.main',
          width: 40,
          height: 40,
        }}
      >
        {isUser ? <PersonIcon /> : <PsychologyIcon />}
      </Avatar>

      <Box
        sx={{
          maxWidth: '70%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isUser ? 'flex-end' : 'flex-start',
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 2,
            bgcolor: isUser 
              ? 'secondary.light' 
              : isError 
                ? 'error.light' 
                : 'background.paper',
            color: isUser ? 'white' : 'text.primary',
            borderRadius: 2,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 10,
              [isUser ? 'right' : 'left']: -8,
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: isUser 
                ? '8px 0 8px 8px'
                : '8px 8px 8px 0',
              borderColor: isUser
                ? `transparent transparent transparent ${isError ? '#f44336' : '#4caf50'}`
                : `transparent ${isError ? '#f44336' : '#fff'} transparent transparent`,
            },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              lineHeight: 1.5,
            }}
          >
            {message.content}
          </Typography>

          {/* Acciones sugeridas por la IA */}
          {message.actions && message.actions.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {message.actions.map((action, index) => (
                <Chip
                  key={index}
                  label={action.title}
                  size="small"
                  variant="outlined"
                  clickable
                  onClick={() => action.onClick && action.onClick()}
                  sx={{
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'primary.light',
                      color: 'white',
                    },
                  }}
                />
              ))}
            </Box>
          )}
        </Paper>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 0.5,
            opacity: 0.7,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {formatTime(message.timestamp)}
          </Typography>

          {!isUser && (
            <>
              <Button
                size="small"
                startIcon={<CopyIcon />}
                onClick={handleCopyMessage}
                sx={{ minWidth: 'auto', p: 0.5 }}
              >
                Copiar
              </Button>
              
              {window.speechSynthesis && (
                <Button
                  size="small"
                  startIcon={<VolumeUpIcon />}
                  onClick={handleSpeak}
                  sx={{ minWidth: 'auto', p: 0.5 }}
                >
                  Escuchar
                </Button>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}