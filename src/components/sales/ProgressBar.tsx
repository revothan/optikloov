
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface ProgressBarProps {
  title: string;
  currentAmount: number;
  targetAmount: number;
  achievement: number;
}

export function ProgressBar({ title, currentAmount, targetAmount, achievement }: ProgressBarProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <div className="text-right">
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(currentAmount)}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                of {formatPrice(targetAmount)}
              </span>
            </div>
          </div>
          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${achievement}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {achievement.toFixed(1)}% achieved
            </span>
            <span className="text-gray-600">
              {formatPrice(Math.max(targetAmount - currentAmount, 0))} to go
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
