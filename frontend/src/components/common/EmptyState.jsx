import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = ShieldAlert,
  title = 'No Records Found',
  description = 'There is currently no telemetry or data recorded in the system database.',
  actionLabel,
  onAction,
  actionIcon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[#20392A] rounded-lg bg-[#08130E]/60 my-4">
      <div className="w-12 h-12 rounded-full bg-[#12271B] border border-[#20392A] flex items-center justify-center text-[#729B81] mb-4">
        <Icon className="w-6 h-6 text-[#39FF88]" />
      </div>
      <h4 className="text-base font-medium text-[#E8F5EC] mb-1 font-mono">{title}</h4>
      <p className="text-sm text-[#9CB4A3] max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} icon={actionIcon} variant="primary" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
