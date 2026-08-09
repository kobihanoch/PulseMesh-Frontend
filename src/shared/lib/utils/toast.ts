export function showErrorToast(message: string, error?: unknown) {
  console.error(message, error ?? '');

  if (typeof window !== 'undefined') {
    import('sonner').then(({ toast }) => toast.error(message));
  }
}

export function showSuccessToast(message: string) {
  if (typeof window !== 'undefined') {
    import('sonner').then(({ toast }) => toast.success(message));
  }
}
