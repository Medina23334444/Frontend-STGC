'use client';
import { useState, useRef, useEffect } from 'react';
import { USER_ROLES } from '@/lib/constants/userRoles';

interface RoleSelectorProps {
  readonly watch: any;
  readonly setValue: any;
  readonly error?: any;
}

export function RoleSelector({ watch, setValue, error }: RoleSelectorProps) {
  const [roleSearch, setRoleSearch] = useState('');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const roleRef = useRef<HTMLDivElement>(null);

  const selectedRole = watch('role_name');
  const selectedRoleLabel = USER_ROLES.find(r => r.value === selectedRole)?.label ?? 'Seleccionar rol...';

  const filteredRoles = USER_ROLES
    .filter(r => r.label.toLowerCase().includes(roleSearch.toLowerCase()))
    .sort((a, b) => a.label.localeCompare(b.label));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
        setRoleSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const borderStyles = error ? 'border-red-300' : 'border-slate-200';
  const ringStyles = roleDropdownOpen ? 'ring-2 ring-sky-500/20 border-sky-500' : '';

  return (
    <div ref={roleRef}>
      <label htmlFor="role_name" className="block text-sm font-semibold text-slate-700 mb-1">Rol de Sistema</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
          className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm text-left flex items-center justify-between transition-all ${borderStyles} ${ringStyles}`}
        >
          <span className={`truncate ${selectedRole ? 'text-slate-800' : 'text-slate-400'}`}>
            {selectedRoleLabel}
          </span>
          <span className="material-symbols-outlined text-slate-400 text-sm shrink-0 ml-1">
            {roleDropdownOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {roleDropdownOpen && (
          <div className="absolute bottom-full mb-1 sm:bottom-auto sm:top-full sm:mt-1 z-10 w-full min-w-[160px] bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
            <div className="p-2 border-b border-slate-100">
              <input
                type="text"
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                placeholder="Buscar rol..."
                autoFocus
              />
            </div>
            <ul className="max-h-40 sm:max-h-48 overflow-y-auto">
              {filteredRoles.length === 0 ? (
                <li className="px-3 py-2 text-sm text-slate-400 italic text-center">Sin resultados</li>
              ) : (
                filteredRoles.map((role) => (
                  <li key={role.value}>
                    <button
                      type="button"
                      onClick={() => {
                        setValue('role_name', role.value);
                        setRoleDropdownOpen(false);
                        setRoleSearch('');
                      }}
                      className={`w-full text-left px-3 py-2 text-sm cursor-pointer hover:bg-sky-50 hover:text-sky-700 transition-colors ${
                        selectedRole === role.value ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      {role.label}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
      {error && <span className="text-xs text-red-500 mt-1 block">{error.message as string}</span>}
    </div>
  );
}