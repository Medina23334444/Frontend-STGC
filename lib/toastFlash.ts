import { toast } from 'sonner';

export type FlashToastType = 'success' | 'error';

interface FlashToastPayload {
  message: string;
  type: FlashToastType;
}

const DEFAULT_FLASH_TOAST_KEY = 'stgc_auth_toast';

export function queueFlashToast(
  message: string,
  type: FlashToastType = 'success',
  key = DEFAULT_FLASH_TOAST_KEY,
): void {
  if (globalThis.window === undefined) return;

  const payload: FlashToastPayload = { message, type };
  sessionStorage.setItem(key, JSON.stringify(payload));
}

export function consumeFlashToast(key = DEFAULT_FLASH_TOAST_KEY): void {
  if (globalThis.window === undefined) return;

  const rawToast = sessionStorage.getItem(key);
  if (!rawToast) return;

  sessionStorage.removeItem(key);

  try {
    const parsed = JSON.parse(rawToast) as Partial<FlashToastPayload>;

    if (typeof parsed.message !== 'string' || parsed.message.trim() === '') return;

    if (parsed.type === 'error') {
      toast.error(parsed.message);
      return;
    }

    toast.success(parsed.message);
  } catch {
  }
}
