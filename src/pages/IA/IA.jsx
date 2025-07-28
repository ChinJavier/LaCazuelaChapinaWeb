import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Paper,
  Avatar,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  Psychology as PsychologyIcon,
  Person as PersonIcon,
  VolumeUp as VolumeUpIcon,
  Analytics as AnalyticsIcon,
  Lightbulb as LightbulbIcon,
  TrendingUp as TrendingUpIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useLLM, useDashboard } from '../../hooks/useData';
import ChatMessage from '../../components/common/ChatMessage';

const SUGGESTIONS = [
  {
    icon: <AnalyticsIcon />,
    title: 'Analizar Ventas',
    description: 'Analiza las tendencias de ventas del día',
    prompt: 'Analiza las ventas del día de hoy y dame insights sobre tendencias y oportunidades de mejora.',
  },
  {
    icon: <LightbulbIcon />,
    title: 'Sugerencias de Combos',
    description: 'Recomienda nuevos combos basados en datos',
    prompt: 'Basándote en los productos más vendidos, sugiere 3 nuevos combos que podrían ser exitosos.',
  },
  {
    icon: <TrendingUpIcon />,
    title: 'Optimizar Inventario',
    description: 'Consejos para gestión de inventario',
    prompt: 'Revisa el estado actual del inventario y dame recomendaciones para optimizar el stock.',
  },
];

export default function IA() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: '¡Hola! Soy tu asistente de IA para La Cazuela Chapina. Puedo ayudarte a analizar ventas, optimizar inventario, sugerir nuevos productos y mucho más. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef(null);
  
  const llmMutation = useLLM();
  const { indicadores } = useDashboard();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim() || llmMutation.isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsAnalyzing(true);

    try {
      // Preparar contexto con datos actuales
      const context = {
        ventas: indicadores.data,
        timestamp: new Date().toISOString(),
        negocio: 'La Cazuela Chapina',
        productos: ['tamales', 'bebidas'],
      };

      const response = await llmMutation.mutateAsync({
        action: 'chat',
        data: {
          message: message,
          context: context,
          conversationHistory: messages.slice(-5), // Últimos 5 mensajes para contexto
        },
      });

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
        actions: response.data.suggestedActions,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.',
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion.prompt);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        id: 1,
        type: 'assistant',
        content: '¡Hola! Soy tu asistente de IA para La Cazuela Chapina. ¿En qué puedo ayudarte?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <Box sx={{ height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Asistente de IA
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Tu copiloto inteligente para La Cazuela Chapina
          </Typography>
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={clearConversation}
          size="small"
        >
          Limpiar Chat
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ flexGrow: 1 }}>
        {/* Sugerencias rápidas */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Sugerencias Rápidas
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {SUGGESTIONS.map((suggestion, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white',
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {suggestion.icon}
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {suggestion.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {suggestion.description}
                    </Typography>
                  </Paper>
                ))}
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Estado del Negocio
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip
                    label={`Ventas Hoy: Q${indicadores.data?.ventasHoy || 0}`}
                    color="primary"
                    size="small"
                  />
                  <Chip
                    label={`Tamales Vendidos: ${indicadores.data?.tamalesVendidosHoy || 0}`}
                    color="secondary"
                    size="small"
                  />
                  <Chip
                    label={`Inventario: ${indicadores.data?.nivelInventario || 0}%`}
                    color={indicadores.data?.nivelInventario < 20 ? 'error' : 'success'}
                    size="small"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Chat */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Mensajes */}
            <Box
              sx={{
                flexGrow: 1,
                p: 2,
                overflowY: 'auto',
                maxHeight: 'calc(100vh - 400px)',
                backgroundColor: 'background.default',
              }}
            >
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isAnalyzing && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <PsychologyIcon />
                  </Avatar>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} />
                    <Typography variant="body2" color="text.secondary">
                      Analizando datos...
                    </Typography>
                  </Box>
                </Box>
              )}
              
              <div ref={messagesEndRef} />
            </Box>

            {/* Input */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu pregunta sobre el negocio..."
                  disabled={llmMutation.isLoading}
                  variant="outlined"
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || llmMutation.isLoading}
                  sx={{ minWidth: 50, borderRadius: 2 }}
                >
                  <SendIcon />
                </Button>
              </Box>
              
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Presiona Enter para enviar, Shift+Enter para nueva línea
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}