// ============================================
// EMPTY STATE
// ============================================

'use client';

import { Button, Paper, Stack, Typography } from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <Paper sx={{ p: 4, textAlign: 'center' }}>
      <Stack spacing={1} alignItems="center">
        {icon ?? <Inventory2OutlinedIcon color="action" />}
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
        {actionLabel && onAction && (
          <Button variant="outlined" size="small" onClick={onAction} sx={{ mt: 1 }}>
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
