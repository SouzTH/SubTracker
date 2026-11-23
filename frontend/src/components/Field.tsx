import { ReactNode } from "react";

// Antes este componente existia copiado em AddSubscription.tsx,
// EditSubscription.tsx e Profile.tsx — exatamente igual nos três lugares.
interface FieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  id?: string;
}

export function Field({ label, children, error, id }: FieldProps) {
  return (
    <div>
      {id ? (
        <label htmlFor={id} className="block text-[13px] text-muted-foreground font-body mb-2">{label}</label>
      ) : (
        <span className="block text-[13px] text-muted-foreground font-body mb-2">{label}</span>
      )}
      {children}
      {error && <p className="text-red-500 text-xs font-body mt-1">{error}</p>}
    </div>
  );
}
