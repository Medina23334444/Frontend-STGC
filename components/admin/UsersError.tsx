// components/users/UsersError.tsx
'use client';

import { ValidationError, ApiError } from '@/lib/errors/ApiErrors';

interface UsersErrorProps {
  readonly error: ApiError;
}

export function UsersError({ error }: UsersErrorProps) {
  return (
    <div className="bg-red-50 p-4 rounded border border-red-200">
      <p className="text-red-700 font-semibold">Error</p>
      <p className="text-red-600">{error.message}</p>
      {error instanceof ValidationError && (
        <ul className="mt-2 text-red-600 list-disc ml-5">
          {Object.entries(error.validationErrors).map(([field, msgs]) => (
            <li key={field}>
              {field}: {Array.isArray(msgs) ? msgs.join(', ') : String(msgs)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}