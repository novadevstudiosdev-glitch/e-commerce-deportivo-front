// ============================================
// LOADING BLOCK
// ============================================

'use client';

import { Paper, Skeleton, Stack } from '@mui/material';

type LoadingBlockProps = {
  rows?: number;
};

export function LoadingBlock({ rows = 3 }: LoadingBlockProps) {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2}>
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} height={28} />
        ))}
      </Stack>
    </Paper>
  );
}
