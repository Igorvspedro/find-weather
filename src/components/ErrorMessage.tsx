import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <Alert className="
      max-w-md mx-auto
      bg-destructive/20 backdrop-blur-glass border border-destructive/30
      text-destructive-foreground
      shadow-glass
    ">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-sm">
        {message}
      </AlertDescription>
    </Alert>
  );
};