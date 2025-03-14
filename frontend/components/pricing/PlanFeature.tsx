import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface PlanFeatureProps {
  name: string;
  included?: boolean;
  value?: string;
}

export default function PlanFeature({ name, included, value }: PlanFeatureProps) {
  return (
    <li className="flex items-start">
      <div className="flex-shrink-0">
        {included !== undefined ? (
          included ? (
            <CheckIcon className="h-5 w-5 text-green-500" />
          ) : (
            <XMarkIcon className="h-5 w-5 text-gray-400" />
          )
        ) : null}
      </div>
      <div className="ml-3">
        <p className="text-sm text-gray-700">
          {name}
          {value && (
            <span className="font-semibold text-gray-900"> {value}</span>
          )}
        </p>
      </div>
    </li>
  );
} 