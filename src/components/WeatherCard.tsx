import { WeatherData } from '@/types/weather';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge,
  MapPin
} from 'lucide-react';
import { Card } from '@/components/ui/card';

interface WeatherCardProps {
  weather: WeatherData;
}

const getWeatherIconUrl = (icon: string): string => {
  return `https://openweathermap.org/img/wn/${icon}@4x.png`;
};

const capitalizeDescription = (description: string): string => {
  return description.charAt(0).toUpperCase() + description.slice(1);
};

export const WeatherCard = ({ weather }: WeatherCardProps) => {
  return (
    <Card className="
      w-full max-w-md mx-auto
      bg-white/25 backdrop-blur-glass border border-white/20
      shadow-glass hover:shadow-glow
      transition-all duration-500
      animate-float
    ">
      <div className="p-8 text-center space-y-6">
        {/* Location */}
        <div className="flex items-center justify-center space-x-2 text-foreground">
          <MapPin className="h-5 w-5" />
          <h2 className="text-xl font-semibold">
            {weather.city}, {weather.country}
          </h2>
        </div>

        {/* Main Weather Display */}
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <img 
              src={getWeatherIconUrl(weather.icon)}
              alt={weather.description}
              className="w-24 h-24 animate-pulse-glow"
            />
          </div>
          
          <div>
            <div className="text-5xl font-bold text-foreground mb-2">
              {weather.temperature}°C
            </div>
            <div className="text-lg text-foreground/80 capitalize">
              {capitalizeDescription(weather.description)}
            </div>
            <div className="text-sm text-foreground/70">
              Sensação térmica: {weather.feelsLike}°C
            </div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="
            bg-white/20 backdrop-blur-glass rounded-lg p-4
            border border-white/20 transition-all duration-300
            hover:bg-white/30
          ">
            <div className="flex items-center space-x-2 text-foreground/80">
              <Droplets className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Umidade</span>
            </div>
            <div className="text-xl font-bold text-foreground mt-1">
              {weather.humidity}%
            </div>
          </div>

          <div className="
            bg-white/20 backdrop-blur-glass rounded-lg p-4
            border border-white/20 transition-all duration-300
            hover:bg-white/30
          ">
            <div className="flex items-center space-x-2 text-foreground/80">
              <Wind className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Vento</span>
            </div>
            <div className="text-xl font-bold text-foreground mt-1">
              {weather.windSpeed} m/s
            </div>
          </div>

          <div className="
            bg-white/20 backdrop-blur-glass rounded-lg p-4
            border border-white/20 transition-all duration-300
            hover:bg-white/30
          ">
            <div className="flex items-center space-x-2 text-foreground/80">
              <Gauge className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Pressão</span>
            </div>
            <div className="text-xl font-bold text-foreground mt-1">
              {weather.pressure} hPa
            </div>
          </div>

          <div className="
            bg-white/20 backdrop-blur-glass rounded-lg p-4
            border border-white/20 transition-all duration-300
            hover:bg-white/30
          ">
            <div className="flex items-center space-x-2 text-foreground/80">
              <Eye className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Visibilidade</span>
            </div>
            <div className="text-xl font-bold text-foreground mt-1">
              {weather.visibility} km
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};