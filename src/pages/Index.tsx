import { useState, useCallback, useEffect } from 'react';
import { WeatherApi } from '@/services/weatherApi';
import { WeatherData } from '@/types/weather';
import { SearchBar } from '@/components/SearchBar';
import { WeatherCard } from '@/components/WeatherCard';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Cloud, Sun, CloudRain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load saved city from localStorage on mount
  useEffect(() => {
    const savedCity = localStorage.getItem('weather-last-city');
    if (savedCity) {
      handleSearch(savedCity);
    }
  }, []);

  const handleSearch = useCallback(async (city: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const weatherData = await WeatherApi.getCurrentWeather(city);
      setWeather(weatherData);
      
      // Save to localStorage
      localStorage.setItem('weather-last-city', city);
      
      toast({
        title: 'Sucesso!',
        description: `Dados do clima para ${weatherData.city} carregados.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleLocationSearch = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador');
      return;
    }

    setIsLocationLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weatherData = await WeatherApi.getCurrentWeatherByCoords(latitude, longitude);
          setWeather(weatherData);
          
          // Save to localStorage
          localStorage.setItem('weather-last-city', weatherData.city);
          
          toast({
            title: 'Localização encontrada!',
            description: `Dados do clima para sua localização atual carregados.`,
          });
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar clima por localização';
          setError(errorMessage);
          
          toast({
            variant: 'destructive',
            title: 'Erro',
            description: errorMessage,
          });
        } finally {
          setIsLocationLoading(false);
        }
      },
      (err) => {
        setIsLocationLoading(false);
        let errorMessage = 'Erro ao acessar localização';
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Localização indisponível';
            break;
          case err.TIMEOUT:
            errorMessage = 'Tempo esgotado para obter localização';
            break;
        }
        
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Erro de localização',
          description: errorMessage,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-sky relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Cloud className="absolute top-20 left-10 h-16 w-16 text-white/20 animate-float" />
        <Sun className="absolute top-32 right-20 h-20 w-20 text-white/30 animate-float" style={{ animationDelay: '1s' }} />
        <CloudRain className="absolute bottom-32 left-20 h-12 w-12 text-white/25 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4 drop-shadow-lg">
            WeatherApp
          </h1>
          <p className="text-lg text-foreground/80 max-w-md mx-auto">
            Descubra as condições climáticas em tempo real para qualquer cidade do mundo
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar 
            onSearch={handleSearch}
            onLocationSearch={handleLocationSearch}
            isLoading={isLoading}
            isLocationLoading={isLocationLoading}
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center">
          {error && (
            <ErrorMessage message={error} />
          )}
          
          {weather && !error && (
            <WeatherCard weather={weather} />
          )}
          
          {!weather && !error && !isLoading && (
            <div className="text-center text-foreground/70">
              <Cloud className="h-24 w-24 mx-auto mb-4 opacity-50" />
              <p className="text-lg">
                Digite o nome de uma cidade ou use sua localização para começar
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
