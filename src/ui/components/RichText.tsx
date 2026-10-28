/**
 * Renderização segura de texto do conteúdo. Nunca usa innerHTML: a marcação mínima
 * (**negrito**, `código`, {{Ctrl+C}}) é convertida em elementos React; qualquer outro
 * caractere, incluindo "<", vira texto literal.
 */
import { Fragment, type ReactNode } from 'react';
import { KeyCombo } from './Kbd';

const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\{\{[^}]+\}\})/g;

export function parseInline(text: string, keyPrefix = 'i'): ReactNode[] {
  const parts = text.split(TOKEN);
  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={key}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) return <code key={key}>{part.slice(1, -1)}</code>;
    if (part.startsWith('{{') && part.endsWith('}}')) return <KeyCombo key={key} combo={part.slice(2, -2)} />;
    return <Fragment key={key}>{part}</Fragment>;
  });
}

interface RichTextProps {
  text: string;
  /** "block" separa parágrafos por quebra de linha; "inline" renderiza num <span>. */
  as?: 'block' | 'inline';
  className?: string;
}

export function RichText({ text, as = 'block', className }: RichTextProps) {
  if (as === 'inline') return <span className={className}>{parseInline(text)}</span>;
  const paragraphs = text.split(/\n+/).filter((p) => p.trim());
  return (
    <div className={className ? `rich ${className}` : 'rich'}>
      {paragraphs.map((p, i) => (
        <p key={i}>{parseInline(p, `p${i}`)}</p>
      ))}
    </div>
  );
}

/** Remove a marcação para uso em atributos (aria-label, title). */
export function plainText(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1').replace(/\{\{([^}]+)\}\}/g, '$1');
}
