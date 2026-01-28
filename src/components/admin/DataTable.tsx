'use client';

import { Paper, Stack, Typography, Skeleton, Box } from '@mui/material';
import type { ReactNode } from 'react';
import { EmptyState } from './EmptyState';

type DataTableProps = {
  title: string;
  action?: ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  children: ReactNode;
};

export function DataTable({
  title,
  action,
  isLoading,
  isEmpty = false,
  emptyTitle,
  emptyDescription,
  children,
}: DataTableProps) {
  return (
    <Paper sx={{ p: 2.5, width: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
        {action}
      </Stack>

      {isLoading ? (
        <Box>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={`row-${index}`} height={28} sx={{ mb: 1 }} />
          ))}
        </Box>
      ) : isEmpty && emptyTitle ? (
        <Box sx={{ mt: 1 }}>
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </Box>
      ) : (
        children
      )}
    </Paper>
  );
}
