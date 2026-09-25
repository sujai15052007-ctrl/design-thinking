import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, Info, Warning, X } from '@phosphor-icons/react';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isWarning = toast.type === 'warning';
  const isInfo = toast.type === 'info';

  return (
    <div
      className="toast animate-fade-in-up"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        borderLeft: `4px solid ${
          isSuccess
            ? 'var(--color-success)'
            : isWarning
            ? 'var(--color-warning)'
            : 'var(--color-forest)'
        }`
      }}
      role="alert"
    >
      {isSuccess && <CheckCircle size={22} weight="fill" color="var(--color-success)" />}
      {isWarning && <Warning size={22} weight="fill" color="var(--color-warning)" />}
      {isInfo && <Info size={22} weight="fill" color="var(--color-forest)" />}

      <span style={{ flex: 1, color: 'var(--text-primary)', lineHeight: 1.4 }}>
        {toast.message}
      </span>
    </div>
  );
}
