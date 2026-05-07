interface BadgeProps {
  label: string;
  variant?: 'admin' | 'viewer' | 'success' | 'pending' | 'default';
}

const variantClasses = {
  admin: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
  viewer: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
  success: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  pending: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  default: 'bg-slate-700 text-slate-300',
};

export default function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]}`}>
      {label}
    </span>
  );
}