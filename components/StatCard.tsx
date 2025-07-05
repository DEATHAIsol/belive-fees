interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: string;
}

export default function StatCard({ title, value, subtitle, icon }: StatCardProps) {
  return (
    <div className="bg-secondary rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-3xl">{icon}</div>
        )}
      </div>
    </div>
  );
} 