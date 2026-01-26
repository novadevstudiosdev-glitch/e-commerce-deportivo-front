// ============================================
// EMPTY STATE
// ============================================

'use client';

import { Paper, Stack, Typography } from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Paper sx={{ p: 4, textAlign: 'center' }}>
      <Stack spacing={1} alignItems="center">
        <Inventory2OutlinedIcon color="action" />
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
