import { useState, useCallback } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationSearch: () => void;
  isLoading: boolean;
  isLocationLoading: boolean;
}

export const SearchBar = ({ 
  onSearch, 
  onLocationSearch, 
  isLoading, 
  isLocationLoading 
}: SearchBarProps) => {
  const [city, setCity] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim() && !isLoading) {
      onSearch(city.trim());
    }
  }, [city, onSearch, isLoading]);

  const handleLocationClick = useCallback(() => {
    if (!isLocationLoading) {
      onLocationSearch();
    }
  }, [onLocationSearch, isLocationLoading]);

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <Input
            type="text"
            placeholder="Digite o nome da cidade..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={isLoading}
            className="
              pl-12 pr-20 h-14 text-lg
              bg-white/25 backdrop-blur-glass border border-white/20
              placeholder:text-white/70 text-foreground
              focus:bg-white/30 focus:border-white/40
              transition-all duration-300
              shadow-glass
            "
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
          <Button
            type="submit"
            disabled={!city.trim() || isLoading}
            size="sm"
            className="
              absolute right-2 top-1/2 transform -translate-y-1/2
              bg-primary hover:bg-primary-glow
              text-primary-foreground
              transition-all duration-300
              shadow-glow hover:shadow-glow
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>

      <div className="text-center">
        <Button
          type="button"
          variant="outline"
          onClick={handleLocationClick}
          disabled={isLocationLoading}
          className="
            bg-white/20 backdrop-blur-glass border-white/30
            text-foreground hover:bg-white/30 hover:border-white/50
            transition-all duration-300
            shadow-glass
          "
        >
          {isLocationLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Localizando...
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Usar minha localização
            </>
          )}
        </Button>
      </div>
    </div>
  );
};