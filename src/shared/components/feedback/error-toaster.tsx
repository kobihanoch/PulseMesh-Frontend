'use client';

import { Toaster } from 'sonner';

// Rendered once in the root layout; individual features only call the toast helpers.
export function ErrorToaster() {
  return <Toaster dir="rtl" position="top-center" richColors />;
}
