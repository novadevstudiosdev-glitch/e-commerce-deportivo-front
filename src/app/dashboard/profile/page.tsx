'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import { userService, authService } from '@/services';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dni: '',
    address: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const me = await userService.getMe();
        setForm({
          firstName: me.profile?.first_name || '',
          lastName: me.profile?.last_name || '',
          email: me.email || '',
          phone: me.profile?.phone || '',
          dni: me.profile?.dni || '',
          address: '',
        });
      } catch (error) {
        console.error('Error loading profile', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await userService.updateMe({
        email: form.email,
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        dni: form.dni,
      });
      await authService.getSession();
    } catch (error) {
      console.error('Error updating profile', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #E5E7EB', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700}>
          Mi perfil
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Actualiza tus datos personales.
        </Typography>

        {loading ? (
          <Typography variant="body2" color="text.secondary">
            Cargando perfil...
          </Typography>
        ) : (
          <Box component="form">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField label="Nombre" fullWidth value={form.firstName} onChange={handleChange('firstName')} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Apellido" fullWidth value={form.lastName} onChange={handleChange('lastName')} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Email" fullWidth value={form.email} onChange={handleChange('email')} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Telefono" fullWidth value={form.phone} onChange={handleChange('phone')} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Domicilio" fullWidth value={form.address} onChange={handleChange('address')} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="DNI" fullWidth value={form.dni} onChange={handleChange('dni')} />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              sx={{ mt: 3, bgcolor: '#1E88E5', '&:hover': { bgcolor: '#1976D2' } }}
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
