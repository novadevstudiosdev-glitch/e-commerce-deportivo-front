'use client';

import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import Link from 'next/link';

export default function FavoritesPage() {
  return (
    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #E5E7EB', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700}>
          Favoritos
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Todavia no tienes productos favoritos guardados.
        </Typography>
        <Box>
          <Button
            component={Link}
            href="/product-catalog"
            variant="contained"
            sx={{ bgcolor: '#1E88E5', '&:hover': { bgcolor: '#1976D2' } }}
          >
            Explorar productos
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
