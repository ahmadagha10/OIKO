'use client';

import { motion } from 'motion/react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { calculateCompletion, getIncompleteFields, getFieldDisplayName } from '@/lib/profile-utils';

interface ProfileCompletionBarProps {
  profile: any;
  onCompleteProfile: () => void;
}

export function ProfileCompletionBar({ profile, onCompleteProfile }: ProfileCompletionBarProps) {
  const completion = calculateCompletion(profile);
  const incompleteFields = getIncompleteFields(profile);

  if (completion === 100) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-900">Profile Complete!</p>
            <p className="text-xs text-green-700">Your profile is 100% complete</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6"
    >
      <div className="flex items-start gap-3 mb-3">
        <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-orange-900">Complete Your Profile</p>
            <span className="text-sm font-semibold text-orange-700">{completion}%</span>
          </div>
          <Progress value={completion} className="h-2 mb-2" />
          <p className="text-xs text-orange-700 mb-2">
            Missing {incompleteFields.length} field{incompleteFields.length > 1 ? 's' : ''}:{' '}
            {incompleteFields.slice(0, 3).map(getFieldDisplayName).join(', ')}
            {incompleteFields.length > 3 && ` +${incompleteFields.length - 3} more`}
          </p>
          <Button
            size="sm"
            onClick={onCompleteProfile}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            Complete Profile
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
