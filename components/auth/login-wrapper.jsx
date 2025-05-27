'use client';

import { Suspense } from 'react';
import { LoginForm } from './login-form';

export default function LoginWrapper() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
