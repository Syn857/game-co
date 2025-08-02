interface ProgressIndicatorProps {
  current: number;
  total: number;
}

export default function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-blue-600">
          Question {current} of {total}
        </span>
        <span className="text-sm font-medium text-blue-600">
          {percentage}% Complete
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-blue-600 to-gold-500 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        >
          <div className="h-full bg-white bg-opacity-30 rounded-full animate-pulse" />
        </div>
      </div>
      
      <div className="flex justify-between mt-1">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < current 
                ? 'bg-blue-600' 
                : i === current 
                ? 'bg-gold-500' 
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}