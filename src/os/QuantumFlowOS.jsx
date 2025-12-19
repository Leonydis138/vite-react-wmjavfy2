import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalSquare, FolderTree, Activity, Bitcoin, FileCode, 
  Cloud, Settings, Globe, Lock, Power, Search, ChevronRight, Bell, 
  BatteryCharging, Wifi, Volume2, Hexagon, Zap, Info, Download, 
  RefreshCw, Save, Copy, Clipboard, Scissors, ZoomIn, ZoomOut, 
  Minus, Maximize2, Layers, ChevronLeft, Home, File, Folder, 
  FilePlus, FolderPlus, Grid, List, Palette, Shield, Monitor,
  TrendingUp, TrendingDown, Cpu, HardDrive, MemoryStick, Network,
  DollarSign, Sun, Wind, Droplets, Eye, Moon, Sunrise, Sunset,
  CloudRain, CloudSnow, CloudDrizzle, Loader
} from 'lucide-react';

// ============================================================================
// THEME SYSTEM
// ============================================================================

const THEMES = {
  CYBERPUNK: {
    id: 'CYBERPUNK',
    name: 'Cyberpunk',
    primary: 'text-cyan-400',
    secondary: 'text-purple-400',
    accent: 'cyan',
    bg: 'from-black via-gray-900 to-black',
    header_bg: 'bg-gradient-to-r from-cyan-900/20 to-purple-900/20',
    border: 'border-cyan-500'
  },
  NEON: {
    id: 'NEON',
    name: 'Neon Dreams',
    primary: 'text-pink-400',
    secondary: 'text-blue-400',
    accent: 'pink',
    bg: 'from-black via-purple-900/20 to-black',
    header_bg: 'bg-gradient-to-r from-pink-900/20 to-blue-900/20',
    border: 'border-pink-500'
  },
  MATRIX: {
    id: 'MATRIX',
    name: 'Matrix',
    primary: 'text-emerald-400',
    secondary: 'text-green-400',
    accent: 'emerald',
    bg: 'from-black via-emerald-900/10 to-black',
    header_bg: 'bg-gradient-to-r from-emerald-900/20 to-green-900/20',
    border: 'border-emerald-500'
  },
  OCEAN: {
    id: 'OCEAN',
    name: 'Deep Ocean',
    primary: 'text-blue-400',
    secondary: 'text-teal-400',
    accent: 'blue',
    bg: 'from-black via-blue-900/20 to-black',
    header_bg: 'bg-gradient-to-r from-blue-900/20 to-teal-900/20',
    border: 'border-blue-500'
  },
  SUNSET: {
    id: 'SUNSET',
    name: 'Solar Sunset',
    primary: 'text-orange-400',
    secondary: 'text-red-400',
    accent: 'orange',
    bg: 'from-black via-orange-900/20 to-black',
    header_bg: 'bg-gradient-to-r from-orange-900/20 to-red-900/20',
    border: 'border-orange-500'
  }
};

// ============================================================================
// REAL DATA SERVICES
// ============================================================================

const weatherService = {
  async getWeather() {
    try {
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,is_day&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto');
      const data = await response.json();
      
      return {
        location: 'San Francisco, CA',
        coordinates: { latitude: data.latitude, longitude: data.longitude },
        current: {
          temperature: data.current.temperature_2m,
          apparentTemperature: data.current.apparent_temperature,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          pressure: data.current.pressure_msl,
          cloudCover: data.current.cloud_cover,
          precipitation: data.current.precipitation,
          weatherCode: data.current.weather_code,
          isDay: data.current.is_day === 1
        },
        hourly: {
          time: data.hourly.time.slice(0, 24),
          temperature: data.hourly.temperature_2m.slice(0, 24),
          precipitation: data.hourly.precipitation_probability.slice(0, 24),
          weatherCode: data.hourly.weather_code.slice(0, 24)
        },
        daily: {
          time: data.daily.time,
          maxTemp: data.daily.temperature_2m_max,
          minTemp: data.daily.temperature_2m_min,
          sunrise: data.daily.sunrise,
          sunset: data.daily.sunset,
          weatherCode: data.daily.weather_code
        }
      };
    } catch (error) {
      console.error('Weather fetch error:', error);
      return null;
    }
  },

  getWeatherIcon(code, isDay) {
    const iconMap = {
      0: isDay ? '☀️' : '🌙',
      1: isDay ? '🌤️' : '🌙',
      2: '⛅',
      3: '☁️',
      45: '🌫️',
      48: '🌫️',
      51: '🌦️',
      53: '🌧️',
      55: '🌧️',
      61: '🌧️',
      63: '🌧️',
      65: '🌧️',
      71: '🌨️',
      73: '🌨️',
      75: '🌨️',
      77: '🌨️',
      80: '🌦️',
      81: '⛈️',
      82: '⛈️',
      85: '🌨️',
      86: '🌨️',
      95: '⛈️',
      96: '⛈️',
      99: '⛈️'
    };
    return iconMap[code] || '🌤️';
  },

  getWeatherDescription(code) {
    const descriptions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail',
      99: 'Thunderstorm with heavy hail'
    };
    return descriptions[code] || 'Unknown';
  }
};

const cryptoService = {
  async getCryptoPrices() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,solana,polkadot,dogecoin,ripple,litecoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true');
      const data = await response.json();
      
      const cryptos = [
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', color: 'text-orange-400' },
        { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', color: 'text-purple-400' },
        { id: 'cardano', name: 'Cardano', symbol: 'ADA', color: 'text-blue-400' },
        { id: 'solana', name: 'Solana', symbol: 'SOL', color: 'text-purple-300' },
        { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', color: 'text-pink-400' },
        { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', color: 'text-yellow-400' },
        { id: 'ripple', name: 'XRP', symbol: 'XRP', color: 'text-slate-400' },
        { id: 'litecoin', name: 'Litecoin', symbol: 'LTC', color: 'text-slate-300' }
      ];

      return cryptos.map(crypto => ({
        ...crypto,
        price: data[crypto.id]?.usd || 0,
        change24h: data[crypto.id]?.usd_24h_change || 0,
        volume24h: data[crypto.id]?.usd_24h_vol || 0,
        marketCap: data[crypto.id]?.usd_market_cap || 0
      }));
    } catch (error) {
      console.error('Crypto fetch error:', error);
      return [];
    }
  }
};

// ============================================================================
// BOOT LOADER
// ============================================================================

const BootLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing Quantum Kernel...');
  const [bootStage, setBootStage] = useState(0);

  const bootMessages = [
    'Initializing Quantum Kernel...',
    'Loading Neural Network Core...',
    'Mounting Virtual File System...',
    'Starting Quantum Entanglement Engine...',
    'Calibrating Temporal Synchronization...',
    'Activating Cybernetic Interface...',
    'Establishing Quantum Link...',
    'System Ready'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 8;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        
        const stage = Math.floor(next / (100 / bootMessages.length));
        if (stage > bootStage && stage < bootMessages.length) {
          setBootStage(stage);
          setStatus(bootMessages[stage]);
        }
        
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete, bootStage]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <div className="relative w-full max-w-4xl px-8">
        <div className="flex justify-center mb-12">
          <div className="relative">
            <Hexagon size={120} className="text-cyan-500 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap size={48} className="text-white" />
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            QuantumFlow OS
          </h1>
          <p className="text-slate-400 text-lg">v2.0 • Quantum Processing Enabled</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>{status}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center text-sm text-slate-500">
          <div>
            <div className="font-bold">KERNEL</div>
            <div>Quantum v4.2.1</div>
          </div>
          <div>
            <div className="font-bold">ARCH</div>
            <div>x86_64 • ARM64</div>
          </div>
          <div>
            <div className="font-bold">SECURITY</div>
            <div className="text-emerald-500">AES-256 • QKD</div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-500 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
                opacity: 0.7
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// WINDOW COMPONENT
// ============================================================================

const Window = ({ app, onClose, onMinimize, onMaximize, isMaximized, theme, children }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (isMaximized) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || isMaximized) return;
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: Math.max(0, e.clientY - dragStart.current.y)
      });
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isMaximized]);

  const windowStyle = isMaximized
    ? { top: 0, left: 0, right: 0, bottom: 48, width: '100%', height: 'calc(100vh - 48px)' }
    : { top: position.y, left: position.x, width: size.width, height: size.height };

  return (
    <div
      className="fixed bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      style={windowStyle}
    >
      <div
        className={`${theme.header_bg} backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between cursor-move`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <app.icon size={20} className={theme.primary} />
          <span className="font-bold">{app.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onMinimize}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
            title="Minimize"
          />
          <button
            onClick={onMaximize}
            className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors"
            title="Maximize"
          />
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            title="Close"
          />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

// ============================================================================
// SYSTEM MONITOR APP
// ============================================================================

const AppMonitor = ({ theme }) => {
  const [cpuUsage, setCpuUsage] = useState([]);
  const [memoryUsage, setMemoryUsage] = useState([]);
  const [networkSpeed, setNetworkSpeed] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => [...prev.slice(-29), Math.random() * 100]);
      setMemoryUsage(prev => [...prev.slice(-29), 60 + Math.random() * 20]);
      setNetworkSpeed(prev => [...prev.slice(-29), Math.random() * 10]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentCpu = cpuUsage[cpuUsage.length - 1] || 0;
  const currentMem = memoryUsage[memoryUsage.length - 1] || 0;
  const currentNet = networkSpeed[networkSpeed.length - 1] || 0;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-black/80 to-gray-900/80 p-6 overflow-auto">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu size={20} className="text-blue-400" />
              <span className="text-sm text-slate-400">CPU Usage</span>
            </div>
            <span className="text-2xl font-bold">{currentCpu.toFixed(1)}%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
              style={{ width: `${currentCpu}%` }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MemoryStick size={20} className="text-purple-400" />
              <span className="text-sm text-slate-400">Memory</span>
            </div>
            <span className="text-2xl font-bold">{currentMem.toFixed(1)}%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
              style={{ width: `${currentMem}%` }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-900/20 to-green-900/20 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Network size={20} className="text-emerald-400" />
              <span className="text-sm text-slate-400">Network</span>
            </div>
            <span className="text-2xl font-bold">{currentNet.toFixed(1)} MB/s</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all"
              style={{ width: `${(currentNet / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Activity size={18} className={theme.primary} />
            CPU History
          </h3>
          <div className="h-48 flex items-end gap-1">
            {cpuUsage.map((val, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t transition-all" style={{ height: `${val}%` }} />
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <HardDrive size={18} className={theme.primary} />
            Storage
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>System (C:)</span>
                <span>120 GB / 500 GB</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: '24%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Data (D:)</span>
                <span>850 GB / 2 TB</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: '42.5%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white/5 rounded-xl p-4">
        <h3 className="font-bold mb-4">System Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-slate-400">OS:</span> QuantumFlow v2.0</div>
          <div><span className="text-slate-400">Kernel:</span> 5.15.0-quantum</div>
          <div><span className="text-slate-400">Processor:</span> Intel Core i9-13900K</div>
          <div><span className="text-slate-400">Memory:</span> 32 GB DDR5</div>
          <div><span className="text-slate-400">Graphics:</span> NVIDIA RTX 4090</div>
          <div><span className="text-slate-400">Uptime:</span> 2h 15m</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CRYPTO DASHBOARD APP
// ============================================================================

const AppCrypto = ({ theme }) => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('marketCap');

  useEffect(() => {
    const loadCrypto = async () => {
(false);
    };

    loadWeather();
    const interval = setInterval(loadWeather, 300000);
    return () => clearInterval(interval);
  }, []);

  const convertTemp = (temp) => unit === 'fahrenheit' ? (temp * 9/5) + 32 : temp;
  const getTempUnit = () => unit === 'celsius' ? '°C' : '°F';

  if (loading || !weather) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-b from-black/80 to-gray-900/80">
        <div className="text-center">
          <Cloud size={48} className="mx-auto mb-4 text-slate-400 animate-pulse" />
          <div className="text-slate-400">Loading weather data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-black/80 to-gray-900/80 overflow-auto">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Cloud size={28} className={theme.primary} />
            <div>
              <h2 className="text-2xl font-bold">Weather Station</h2>
              <p className="text-slate-400">{weather.location}</p>
            </div>
          </div>
          <button
            onClick={() => setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius')}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-medium transition-colors"
          >
            {getTempUnit()}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-6xl font-bold">
                {convertTemp(weather.current.temperature).toFixed(1)}{getTempUnit()}
              </div>
              <div className="text-slate-400 mt-2">Feels like {convertTemp(weather.current.apparentTemperature).toFixed(1)}{getTempUnit()}</div>
              <div className="text-lg mt-2">{weatherService.getWeatherDescription(weather.current.weatherCode)}</div>
            </div>
            <div className="text-6xl">
              {weatherService.getWeatherIcon(weather.current.weatherCode, weather.current.isDay)}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-slate-400 text-sm mb-1">Humidity</div>
              <div className="text-2xl font-bold">{weather.current.humidity}%</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-slate-400 text-sm mb-1">Wind</div>
              <div className="text-2xl font-bold">{weather.current.windSpeed.toFixed(1)} m/s</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-slate-400 text-sm mb-1">Pressure</div>
              <div className="text-2xl font-bold">{weather.current.pressure} hPa</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-slate-400 text-sm mb-1">Clouds</div>
              <div className="text-2xl font-bold">{weather.current.cloudCover}%</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-4">Hourly Forecast</h3>
          <div className="grid grid-cols-6 gap-4">
            {weather.hourly.time.slice(0, 6).map((time, idx) => (
              <div key={idx} className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-slate-400 mb-2 text-sm">
                  {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-3xl mb-2">
                  {weatherService.getWeatherIcon(weather.hourly.weatherCode[idx], true)}
                </div>
                <div className="text-xl font-bold">
                  {convertTemp(weather.hourly.temperature[idx]).toFixed(0)}{getTempUnit()}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {weather.hourly.precipitation[idx]}% rain
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-4">7-Day Forecast</h3>
          <div className="space-y-2">
            {weather.daily.time.map((date, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-20 text-slate-400">
                    {new Date(date).toLocaleDateString([], { weekday: 'short' })}
                  </div>
                  <div className="text-2xl">
                    {weatherService.getWeatherIcon(weather.daily.weatherCode[idx], true)}
                  </div>
                  <div className="text-slate-400 flex-1">
                    {weatherService.getWeatherDescription(weather.daily.weatherCode[idx])}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-xl font-bold">
                    {convertTemp(weather.daily.maxTemp[idx]).toFixed(0)}{getTempUnit()}
                  </div>
                  <div className="text-slate-400">
                    {convertTemp(weather.daily.minTemp[idx]).toFixed(0)}{getTempUnit()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TERMINAL APP
// ============================================================================

const AppTerminal = ({ theme }) => {
  const [history, setHistory] = useState([]);
  const [currentCmd, setCurrentCmd] = useState('');
  const [cwd, setCwd] = useState(['home', 'quantum']);
  const terminalRef = useRef(null);

  const commands = {
    help: () => 'Available commands: help, clear, date, echo, neofetch, ls, cd, pwd, whoami, uname',
    clear: () => { setHistory([]); return ''; },
    date: () => new Date().toLocaleString(),
    echo: (args) => args.join(' '),
    neofetch: () => `
╭────────────────────────────────────╮
│        QuantumFlow OS v2.0         │
├────────────────────────────────────┤
│ OS: QuantumFlow Linux              │
│ Kernel: 5.15.0-quantum             │
│ Shell: qsh v3.0                    │
│ CPU: Intel Core i9-13900K          │
│ Memory: 32GB DDR5                  │
│ GPU: NVIDIA RTX 4090               │
│ Theme: ${theme.name.padEnd(23)}│
╰────────────────────────────────────╯`,
    ls: () => 'Documents  Downloads  Desktop  Pictures  Videos  Music',
    cd: (args) => { 
      if (args[0] === '..') setCwd(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
      else if (args[0]) setCwd(prev => [...prev, args[0]]);
      return '';
    },
    pwd: () => '/' + cwd.join('/'),
    whoami: () => 'quantum-user',
    uname: () => 'QuantumFlow 5.15.0-quantum x86_64 GNU/Linux'
  };

  const executeCommand = (cmd) => {
    const [name, ...args] = cmd.trim().split(' ');
    if (!name) return '';
    if (commands[name]) {
      try {
        return commands[name](args);
      } catch (error) {
        return `Error: ${error.message}`;
      }
    }
    return `Command not found: ${name}. Type 'help' for available commands.`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentCmd.trim()) return;

    const output = executeCommand(currentCmd);
    setHistory(prev => [...prev, {
      cmd: currentCmd,
      output,
      timestamp: new Date().toLocaleTimeString(),
      cwd: cwd.join('/')
    }]);
    setCurrentCmd('');
    
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 10);
  };

  return (
    <div className="h-full flex flex-col bg-black/90 font-mono text-sm">
      <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalSquare size={16} className={theme.primary} />
          <span className="font-bold">Quantum Terminal</span>
        </div>
      </div>

      <div ref={terminalRef} className="flex-1 overflow-auto p-4 space-y-2">
        <div className="text-cyan-400 mb-4">
          <pre className="text-xs">
{`╔═══════════════════════════════════════════╗
║   Welcome to Quantum Terminal v3.0       ║
║   Type 'help' for available commands     ║
╚═══════════════════════════════════════════╝`}
          </pre>
        </div>

        {history.map((entry, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">➜</span>
              <span className="text-cyan-400">[{entry.cwd}]</span>
              <span className="text-white">{entry.cmd}</span>
            </div>
            {entry.output && (
              <div className="text-slate-300 ml-4 whitespace-pre-line">{entry.output}</div>
            )}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-emerald-400">➜</span>
          <span className="text-cyan-400">[{cwd.join('/')}]</span>
          <input
            type="text"
            value={currentCmd}
            onChange={(e) => setCurrentCmd(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white"
            autoFocus
          />
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// FILE EXPLORER APP
// ============================================================================

const AppExplorer = ({ theme }) => {
  const [path, setPath] = useState(['Home']);
  const [files] = useState({
    'Home': ['Documents', 'Downloads', 'Desktop', 'Pictures', 'Videos', 'Music'],
    'Documents': ['Work', 'Personal', 'Projects'],
    'Downloads': ['quantum_sdk.zip', 'documentation.pdf'],
    'Desktop': ['README.md', 'project.quantum']
  });

  const currentFiles = files[path[path.length - 1]] || [];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-black/80 to-gray-900/80">
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <button 
          onClick={() => path.length > 1 && setPath(path.slice(0, -1))}
          className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-50"
          disabled={path.length <= 1}
        >
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => setPath(['Home'])} className="p-2 hover:bg-white/10 rounded-lg">
          <Home size={20} />
        </button>
        <div className="text-sm text-slate-400 flex items-center gap-2">
          {path.map((dir, idx) => (
            <span key={idx} className="flex items-center gap-2">
              {idx > 0 && <ChevronRight size={12} />}
              {dir}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentFiles.map((file) => (
            <button
              key={file}
              onClick={() => files[file] && setPath([...path, file])}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all hover:scale-105"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 rounded-lg bg-white/5">
                  {files[file] ? (
                    <Folder size={32} className="text-yellow-500" />
                  ) : (
                    <File size={32} className="text-blue-400" />
                  )}
                </div>
                <div className="font-medium truncate max-w-full">{file}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SETTINGS APP
// ============================================================================

const AppSettings = ({ theme, setThemeId }) => {
  const [activeTab, setActiveTab] = useState('appearance');

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-black/80 to-gray-900/80">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Settings size={28} className={theme.primary} />
          <div>
            <h2 className="text-2xl font-bold">System Settings</h2>
            <p className="text-slate-400">Configure QuantumFlow</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 border-r border-white/10 p-6">
          <div className="space-y-1">
            {['appearance', 'system', 'network', 'privacy'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                  activeTab === tab ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'appearance' && (
            <div>
              <h3 className="text-xl font-bold mb-6">Appearance</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(THEMES).map(t => (
                  <button
                    key={t.id}
                    onClick={() => setThemeId(t.id)}
                    className={`p-4 rounded-xl border transition-all hover:scale-105 ${
                      theme.id === t.id ? 'border-cyan-500 ring-2 ring-cyan-500/30' : 'border-white/10'
                    }`}
                  >
                    <div className={`h-8 rounded-lg mb-3 ${t.header_bg}`} />
                    <div className="font-medium">{t.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN OS COMPONENT
// ============================================================================

export default function QuantumFlowOS() {
  const [booted, setBooted] = useState(false);
  const [themeId, setThemeId] = useState('CYBERPUNK');
  const [time, setTime] = useState(new Date());
  const [apps, setApps] = useState([]);
  const [showLauncher, setShowLauncher] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const theme = THEMES[themeId];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') setShowSearch(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const appDefinitions = {
    terminal: { type: 'terminal', title: 'Terminal', icon: TerminalSquare, component: AppTerminal },
    explorer: { type: 'explorer', title: 'File Explorer', icon: FolderTree, component: AppExplorer },
    monitor: { type: 'monitor', title: 'System Monitor', icon: Activity, component: AppMonitor },
    crypto: { type: 'crypto', title: 'Crypto Dashboard', icon: Bitcoin, component: AppCrypto },
    weather: { type: 'weather', title: 'Weather', icon: Cloud, component: AppWeather },
    settings: { type: 'settings', title: 'Settings', icon: Settings, component: AppSettings }
  };

  const openApp = (type) => {
    const existing = apps.find(app => app.type === type);
    if (existing) {
      setApps(apps.map(app => app.type === type ? { ...app, minimized: false, active: true } : { ...app, active: false }));
    } else {
      const def = appDefinitions[type];
      if (def) {
        setApps([...apps.map(a => ({ ...a, active: false })), { 
          ...def, 
          id: Date.now(), 
          active: true, 
          minimized: false, 
          maximized: false 
        }]);
      }
    }
    setShowLauncher(false);
    setShowSearch(false);
  };

  const closeApp = (id) => setApps(apps.filter(app => app.id !== id));
  const minimizeApp = (id) => setApps(apps.map(app => app.id === id ? { ...app, minimized: true } : app));
  const maximizeApp = (id) => setApps(apps.map(app => app.id === id ? { ...app, maximized: !app.maximized } : app));

  if (!booted) {
    return <BootLoader onComplete={() => setBooted(true)} />;
  }

  return (
    <div className={`h-screen w-screen bg-gradient-to-br ${theme.bg} text-white overflow-hidden relative`}>
      {/* Wallpaper */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)',
        }} />
      </div>

      {/* Windows */}
      {apps.filter(app => !app.minimized).map(app => (
        <Window
          key={app.id}
          app={app}
          theme={theme}
          isMaximized={app.maximized}
          onClose={() => closeApp(app.id)}
          onMinimize={() => minimizeApp(app.id)}
          onMaximize={() => maximizeApp(app.id)}
        >
          <app.component theme={theme} setThemeId={setThemeId} />
        </Window>
      ))}

      {/* App Launcher */}
      {showLauncher && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center" onClick={() => setShowLauncher(false)}>
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-8 border border-white/10" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">Applications</h2>
            <div className="grid grid-cols-3 gap-4">
              {Object.values(appDefinitions).map(app => (
                <button
                  key={app.type}
                  onClick={() => openApp(app.type)}
                  className="p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all hover:scale-105"
                >
                  <app.icon size={32} className={`mx-auto mb-3 ${theme.primary}`} />
                  <div className="font-medium">{app.title}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      {showSearch && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-32">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSearch(false)} />
          <div className="relative w-full max-w-2xl mx-4">
            <input
              autoFocus
              placeholder="Search apps..."
              className="w-full px-6 py-4 bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl text-lg outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 via-black/60 to-black/40 backdrop-blur-xl border-t border-white/10 z-[9999] flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLauncher(!showLauncher)}
            className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 transition-all hover:scale-105"
          >
            <Hexagon size={20} className="text-white" />
          </button>
          <div className="flex items-center gap-1 ml-4">
            {apps.filter(app => !app.minimized).map(app => (
              <button
                key={app.id}
                onClick={() => openApp(app.type)}
                className={`p-2.5 rounded-xl transition-all ${app.active ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}
              >
                <app.icon size={18} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Wifi size={18} className="text-cyan-400" />
          <Volume2 size={18} className="text-purple-400" />
          <div className="text-sm font-bold">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
    </div>
  );
}(true);
      const data = await cryptoService.getCryptoPrices();
      setCryptos(data);
      setLoading(false);
    };

    loadCrypto();
    const interval = setInterval(loadCrypto, 60000);
    return () => clearInterval(interval);
  }, []);

  const sortedCryptos = [...cryptos].sort((a, b) => {
    if (sortBy === 'price') return b.price - a.price;
    if (sortBy === 'change') return b.change24h - a.change24h;
    return b.marketCap - a.marketCap;
  });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-b from-black/80 to-gray-900/80">
        <div className="text-center">
          <Loader size={48} className="mx-auto mb-4 text-cyan-400 animate-spin" />
          <div className="text-slate-400">Loading market data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-black/80 to-gray-900/80">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Bitcoin size={28} className={theme.primary} />
            <div>
              <h2 className="text-2xl font-bold">Crypto Dashboard</h2>
              <p className="text-slate-400">Real-time market data</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('marketCap')}
              className={`px-4 py-2 rounded-xl transition-colors ${sortBy === 'marketCap' ? 'bg-cyan-500' : 'bg-white/5 hover:bg-white/10'}`}
            >
              Market Cap
            </button>
            <button
              onClick={() => setSortBy('price')}
              className={`px-4 py-2 rounded-xl transition-colors ${sortBy === 'price' ? 'bg-cyan-500' : 'bg-white/5 hover:bg-white/10'}`}
            >
              Price
            </button>
            <button
              onClick={() => setSortBy('change')}
              className={`px-4 py-2 rounded-xl transition-colors ${sortBy === 'change' ? 'bg-cyan-500' : 'bg-white/5 hover:bg-white/10'}`}
            >
              Change
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedCryptos.map(crypto => (
            <div key={crypto.id} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-2xl font-bold ${crypto.color}`}>{crypto.symbol}</span>
                    <span className="text-slate-400">{crypto.name}</span>
                  </div>
                  <div className="text-3xl font-bold">${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${crypto.change24h >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {crypto.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span className="font-bold">{Math.abs(crypto.change24h).toFixed(2)}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-400 mb-1">Market Cap</div>
                  <div className="font-medium">${(crypto.marketCap / 1e9).toFixed(2)}B</div>
                </div>
                <div>
                  <div className="text-slate-400 mb-1">24h Volume</div>
                  <div className="font-medium">${(crypto.volume24h / 1e9).toFixed(2)}B</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 p-4 text-center text-sm text-slate-400">
        <p>Data provided by CoinGecko • Updates every minute</p>
      </div>
    </div>
  );
};

// ============================================================================
// WEATHER APP
// ============================================================================

const AppWeather = ({ theme }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState('celsius');

  useEffect(() => {
    const loadWeather = async () => {
      setLoading(true);
      const data = await weatherService.getWeather();
      setWeather(data);
      setLoading
