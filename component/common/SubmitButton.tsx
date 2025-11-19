'use client';

import { useFormStatus } from 'react-dom';
import Button from './Button';

interface SubmitButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function SubmitButton({ children = '제출', variant = 'primary', size = 'md', fullWidth = false }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant={variant} size={size} loading={pending} disabled={pending} fullWidth={fullWidth}>
      {children}
    </Button>
  );
}

