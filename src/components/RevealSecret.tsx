import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { CopyButton } from './CopyButton';

interface RevealSecretProps {
  secret: string;
  masked?: string;
}

export function RevealSecret({ secret, masked }: RevealSecretProps) {
  const [revealed, setRevealed] = useState(false);
  
  const maskedValue = masked || '•'.repeat(secret.length);

  return (
    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
      <code className="flex-1 text-sm font-mono text-gray-900">
        {revealed ? secret : maskedValue}
      </code>
      <button
        onClick={() => setRevealed(!revealed)}
        className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
        title={revealed ? 'Hide' : 'Reveal'}
      >
        {revealed ? (
          <EyeOff className="w-4 h-4 text-gray-600" />
        ) : (
          <Eye className="w-4 h-4 text-gray-600" />
        )}
      </button>
      <CopyButton text={secret} />
    </div>
  );
}


