import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { 
  Container, 
  Paper, 
  Typography, 
  Button, 
  TextField, 
  MenuItem, 
  Box,
  createTheme,
  ThemeProvider
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';

// Create futuristic theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff95',
    },
    secondary: {
      main: '#7b1fa2',
    },
    background: {
      default: '#000000',
      paper: 'rgba(10, 10, 30, 0.95)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      background: 'linear-gradient(45deg, #00ff95 30%, #00e5ff 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 700,
    },
    h6: {
      color: '#00ff95',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(rgba(10, 10, 30, 0.95), rgba(10, 10, 30, 0.95))',
          borderRadius: 16,
          border: '1px solid rgba(0, 255, 149, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 255, 149, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '10px 24px',
          background: 'linear-gradient(45deg, #00ff95 30%, #00e5ff 90%)',
          color: '#000000',
          fontWeight: 600,
          '&:hover': {
            background: 'linear-gradient(45deg, #00e5ff 30%, #00ff95 90%)',
            boxShadow: '0 0 15px rgba(0, 255, 149, 0.5)',
          },
        },
      },
    },
  },
});

const CryptoPrediction = () => {
  const [predictionData, setPredictionData] = useState(null);
  const [symbol, setSymbol] = useState('bitcoin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCoins, setFilteredCoins] = useState([]);

  const translations = {
    id: {
      title: 'Crypto Vision Predictor',
      selectCrypto: 'Pilih Cryptocurrency',
      analyze: 'Analisis Prediksi',
      loading: 'Memuat...',
      currentPrice: 'Harga Saat Ini',
      predictionRange: 'Rentang Prediksi',
      confidenceLevel: 'Tingkat Kepercayaan',
      marketAnalysis: 'Analisis Pasar',
      sentiment: 'Sentimen',
      strength: 'Kekuatan',
      trendDirection: 'Arah Trend',
      averageChange: 'Perubahan Rata-rata',
      supportResistance: 'Level Support & Resistance',
      resistance: 'Resistance',
      support: 'Support',
      keyIndicators: 'Indikator Utama',
      detailedAnalysis: 'Analisis Detail',
      predictionChart: 'Grafik Prediksi 24 Jam Kedepan',
      actualLine: 'Data Aktual',
      predictionLine: 'Prediksi',
    },
    en: {
      title: 'Crypto Vision Predictor',
      selectCrypto: 'Select Cryptocurrency',
      analyze: 'Analyze Prediction',
      loading: 'Loading...',
      currentPrice: 'Current Price',
      predictionRange: 'Prediction Range',
      confidenceLevel: 'Confidence Level',
      marketAnalysis: 'Market Analysis',
      sentiment: 'Sentiment',
      strength: 'Strength',
      trendDirection: 'Trend Direction',
      averageChange: 'Average Change',
      supportResistance: 'Support & Resistance Levels',
      resistance: 'Resistance',
      support: 'Support',
      keyIndicators: 'Key Indicators',
      detailedAnalysis: 'Detailed Analysis',
      predictionChart: '24-Hour Prediction Chart',
      actualLine: 'Actual Data',
      predictionLine: 'Prediction',
    }
  };
  const availableCoins = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', symbol: '₿' },
    { value: 'ethereum', label: 'Ethereum (ETH)', symbol: 'Ξ' },
    { value: 'binancecoin', label: 'Binance Coin (BNB)', symbol: '₿' },
    { value: 'ripple', label: 'Ripple (XRP)', symbol: '✕' },
    { value: 'cardano', label: 'Cardano (ADA)', symbol: '₳' },
    { value: 'solana', label: 'Solana (SOL)', symbol: '◎' },
    { value: 'polkadot', label: 'Polkadot (DOT)', symbol: '•' },
    { value: 'dogecoin', label: 'Dogecoin (DOGE)', symbol: 'Ð' },
    { value: 'tron', label: 'TRON (TRX)', symbol: '⚡' },
    { value: 'chainlink', label: 'Chainlink (LINK)', symbol: '⬡' },
    { value: 'litecoin', label: 'Litecoin (LTC)', symbol: 'Ł' },
    { value: 'polygon', label: 'Polygon (MATIC)', symbol: '⬡' },
    { value: 'stellar', label: 'Stellar (XLM)', symbol: '*' },
    { value: 'monero', label: 'Monero (XMR)', symbol: 'ɱ' },
    { value: 'cosmos', label: 'Cosmos (ATOM)', symbol: '⚛' },
    { value: 'worldcoin', label: 'Worldcoin (WLD)', symbol: '🌍' }
  ];

  const getPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://846c-182-54-141-154.ngrok-free.app/predict', {
        symbol: symbol,
        timeframe: '24h'
      });
      setPredictionData(response.data.data);
    } catch (err) {
      setError('Error occurred while fetching data');
    }
    setLoading(false);
  };

  const formatChartData = () => {
    if (!predictionData) return [];
    
    // Mendapatkan data historis
    const historicalPrices = predictionData.historical_prices.sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    return predictionData.hourly_predictions.map((price, index) => {
      if (index < 6) {
        // Data aktual
        return {
          hour: index,
          actual: historicalPrices[index]?.price || null,
          prediction: null
        };
      } else if (index === 6) {
        // Titik transisi
        return {
          hour: index,
          actual: historicalPrices[5]?.price || null,
          prediction: price
        };
      } else {
        // Data prediksi
        return {
          hour: index,
          actual: null,
          prediction: price
        };
      }
    });
  };

  // Function to determine color based on sentiment
  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'BULLISH': return '#00ff95';
      case 'BEARISH': return '#ff4d4d';
      case 'NEUTRAL': return '#ffb700';
      default: return '#ffffff';
    }
  };

  // Function to display trend direction with icon
  const getTrendIcon = (direction) => {
    switch(direction) {
      case 'BULLISH': return '↗️';
      case 'BEARISH': return '↘️';
      case 'NEUTRAL': return '➡️';
      default: return '➡️';
    }
  };

  const LanguageSelector = () => (
    <Box sx={{ 
      position: 'absolute', 
      top: 20, 
      right: 20,
      display: 'flex',
      gap: 1,
      alignItems: 'center'
    }}>
      <LanguageIcon sx={{ color: '#00ff95' }} />
      <Button
        size="small"
        onClick={() => setLanguage('id')}
        sx={{ 
          color: language === 'id' ? '#00ff95' : '#ffffff',
          borderBottom: language === 'id' ? '2px solid #00ff95' : 'none',
          minWidth: 'auto',
          background: 'transparent',
          '&:hover': {
            background: 'transparent',
            opacity: 0.8
          }
        }}
      >
        ID 🇮🇩
      </Button>
      <Button
        size="small"
        onClick={() => setLanguage('en')}
        sx={{ 
          color: language === 'en' ? '#00ff95' : '#ffffff',
          borderBottom: language === 'en' ? '2px solid #00ff95' : 'none',
          minWidth: 'auto',
          background: 'transparent',
          '&:hover': {
            background: 'transparent',
            opacity: 0.8
          }
        }}
      >
        EN 🇬🇧
      </Button>
    </Box>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #000000 0%, #1a1a3a 100%)',
        py: 4
      }}>
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ 
            p: 4, 
            backdropFilter: 'blur(10px)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #00ff95, transparent)',
            }
          }}>
            <LanguageSelector />

            <Typography variant="h4" gutterBottom align="center">
              {translations[language].title}
            </Typography>

            <Box sx={{ 
              mb: 4,
              display: 'flex',
              justifyContent: 'center',
              gap: 2
            }}>
              <Box sx={{ width: 200 }}>
                <TextField
                  select
                  label={translations[language].selectCrypto}
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  sx={{ 
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 255, 149, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(0, 255, 149, 0.5)',
                      },
                    },
                  }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
                          backgroundColor: 'rgba(10, 10, 30, 0.95)',
                          '&::-webkit-scrollbar': {
                            width: '8px',
                          },
                          '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(0, 255, 149, 0.3)',
                            borderRadius: '4px',
                          },
                        },
                      },
                    },
                  }}
                >
                  <Box sx={{ p: 1 }}>
                    <TextField
                      size="small"
                      placeholder={language === 'id' ? "Cari cryptocurrency..." : "Search cryptocurrency..."}
                      value={searchTerm}
                      onChange={(e) => {
                        const term = e.target.value.toLowerCase();
                        setSearchTerm(term);
                        const filtered = availableCoins.filter(coin =>
                          coin.label.toLowerCase().includes(term) ||
                          coin.value.toLowerCase().includes(term)
                        );
                        setFilteredCoins(filtered);
                      }}
                      sx={{
                        mb: 1,
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'rgba(0, 255, 149, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(0, 255, 149, 0.5)',
                          },
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Box>
                  {(searchTerm ? filteredCoins : availableCoins).map((coin) => (
                    <MenuItem 
                      key={coin.value} 
                      value={coin.value}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(0, 255, 149, 0.1)',
                        }
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        width: '100%',
                        alignItems: 'center'
                      }}>
                        <span>{coin.label}</span>
                        <span style={{ opacity: 0.7 }}>{coin.symbol}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Button 
                variant="contained" 
                onClick={getPrediction}
                disabled={loading}
                sx={{
                  color: '#000000'
                }}
              >
                {loading ? translations[language].loading : translations[language].analyze}
              </Button>
            </Box>

            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            {predictionData && (
              <Box sx={{ display: 'grid', gap: 3 }}>
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: 2,
                }}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6">
                      {translations[language].currentPrice}
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#00ff95' }}>
                      ${predictionData.current_price.toLocaleString()}
                    </Typography>
                  </Paper>

                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6">
                      {translations[language].predictionRange}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#00e5ff' }}>
                      ${predictionData.predicted_range.low.toLocaleString()} - ${predictionData.predicted_range.high.toLocaleString()}
                    </Typography>
                  </Paper>

                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6">
                      {translations[language].confidenceLevel}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#00ff95' }}>
                      {predictionData.confidence_level}
                    </Typography>
                  </Paper>
                </Box>

                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: 2,
                }}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {translations[language].marketAnalysis}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography sx={{ 
                        color: getSentimentColor(predictionData.market_analysis.sentiment)
                      }}>
                        {translations[language].sentiment}: {predictionData.market_analysis.sentiment}
                        <Typography component="span" sx={{ ml: 1 }}>
                          ({translations[language].strength}: {predictionData.market_analysis.sentiment_strength}/10)
                        </Typography>
                      </Typography>
                      
                      <Typography>
                        {translations[language].trendDirection}: {getTrendIcon(predictionData.trend_analysis.trend_direction)} 
                        {predictionData.trend_analysis.trend_direction}
                      </Typography>
                      
                      <Typography>
                        {translations[language].averageChange}: {predictionData.trend_analysis.average_change_percentage}%
                      </Typography>
                    </Box>
                  </Paper>

                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {translations[language].supportResistance}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography sx={{ color: '#ff4d4d' }}>
                        {translations[language].resistance}: ${predictionData.market_analysis.resistance_levels.map(level => 
                          level.toLocaleString()).join(', ')}
                      </Typography>
                      <Typography sx={{ color: '#00ff95' }}>
                        {translations[language].support}: ${predictionData.market_analysis.support_levels.map(level => 
                          level.toLocaleString()).join(', ')}
                      </Typography>
                    </Box>
                  </Paper>

                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {translations[language].keyIndicators}
                    </Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      {predictionData.market_analysis.key_indicators.map((indicator, index) => (
                        <Typography component="li" key={index} sx={{ mb: 1 }}>
                          {indicator}
                        </Typography>
                      ))}
                    </Box>
                  </Paper>
                </Box>

                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {translations[language].detailedAnalysis}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ffffff' }}>
                    {predictionData.analysis}
                  </Typography>
                </Paper>

                <Typography variant="h6" gutterBottom align="center">
                  {translations[language].predictionChart}
                </Typography>

                <Box sx={{ 
                  background: 'rgba(0, 0, 0, 0.3)',
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid rgba(0, 255, 149, 0.1)',
                  width: '100%',
                  overflow: 'hidden'
                }}>
                  <LineChart
                    width={800}
                    height={400}
                    data={formatChartData()}
                    margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="rgba(255, 255, 255, 0.1)"
                      vertical={false}
                    />
                    <XAxis 
                      dataKey="hour" 
                      label={{ value: 'Hour', position: 'bottom', fill: '#00ff95' }}
                      stroke="#00ff95"
                      tick={{ fill: '#00ff95' }}
                    />
                    <YAxis 
                      label={{ 
                        value: 'Price ($)', 
                        angle: -90, 
                        position: 'left', 
                        fill: '#00ff95' 
                      }}
                      stroke="#00ff95"
                      tick={{ fill: '#00ff95' }}
                      domain={['auto', 'auto']}
                      tickFormatter={(value) => value.toLocaleString()}
                      scale="linear"
                      padding={{ top: 20, bottom: 20 }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        border: '1px solid #00ff95',
                        borderRadius: 8,
                        boxShadow: '0 0 10px rgba(0, 255, 149, 0.3)',
                      }}
                      formatter={(value) => [
                        value ? `$${Number(value).toFixed(6)}` : '-',
                        ''
                      ]}
                      labelFormatter={(label) => `Hour ${label}`}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={36}
                      wrapperStyle={{
                        paddingBottom: '20px',
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="actual"
                      name="Data Aktual"
                      stroke="#00ff95" 
                      strokeWidth={3}
                      dot={{
                        r: 6,
                        fill: "#00ff95",
                        stroke: "#000000",
                        strokeWidth: 2
                      }}
                      activeDot={{
                        r: 8,
                        stroke: "#00ff95",
                        strokeWidth: 2,
                        fill: "#000000"
                      }}
                      connectNulls={true}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="prediction"
                      name="Prediksi"
                      stroke="#00e5ff" 
                      strokeWidth={3}
                      dot={false}
                      connectNulls={true}
                    />
                  </LineChart>
                </Box>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#00ff95' }}>
                    ● {translations[language].actualLine}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#00e5ff' }}>
                    ● {translations[language].predictionLine}
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default CryptoPrediction;