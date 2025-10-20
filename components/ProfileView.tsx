import React, { useState, useEffect } from 'react';
import { UserData } from '../types';
import { SaveIcon, AdjustIcon, InfoIcon, CheckCircleIcon } from './IconComponents';
import DarkModeToggle from './DarkModeToggle';

interface Props {
  userData: UserData;
  onUpdate: (data: Partial<UserData>) => void;
  onInitiateReadjust: () => void;
  theme: string;
  setTheme: (theme: string) => void;
  isSubscribed: boolean;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const ProfileView: React.FC<Props> = ({ userData, onUpdate, onInitiateReadjust, theme, setTheme, isSubscribed, isLoggedIn, onLogout }) => {
  const [formData, setFormData] = useState(userData);
  const [hasChanged, setHasChanged] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(userData);
  }, [userData]);

  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(userData);
    setHasChanged(changed);
  }, [formData, userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['age', 'weight', 'height'].includes(name);
    const processedValue = isNumeric ? (value === '' ? '' : Number(value)) : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setShowSuccess(false);

    setTimeout(() => {
      onUpdate(formData);
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 500);
  };

  return (
    <div className="bg-amber-100/80 dark:bg-slate-800/80 p-6 sm:p-8 rounded-2xl shadow-lg border border-amber-300/40 dark:border-slate-700/60 animate-fade-in-up">
        <div className="border-b border-amber-200 dark:border-slate-700 pb-5">
            <h2 className="text-2xl font-bold text-amber-950 dark:text-slate-100">Tu Perfil de Atleta</h2>
            <p className="mt-1 text-sm text-amber-800 dark:text-slate-400">Mantén tus datos actualizados para que la IA ajuste tu plan con precisión.</p>
        </div>
      
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-amber-800 dark:text-slate-300 mb-1">Nombre</label>
                  <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="block w-full px-4 py-2.5 text-amber-950 bg-white/75 border border-amber-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
                </div>
                 <div>
                  <label htmlFor="email" className="block text-sm font-medium text-amber-800 dark:text-slate-300 mb-1">Email</label>
                  <input type="email" name="email" id="email" value={formData.email} disabled={isLoggedIn} className="block w-full px-4 py-2.5 text-slate-500 bg-slate-200/80 dark:bg-slate-700/50 dark:text-slate-400 border border-amber-300 rounded-xl shadow-sm sm:text-sm cursor-not-allowed" />
                </div>
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-amber-800 dark:text-slate-300 mb-1">Edad</label>
                  <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} className="block w-full px-4 py-2.5 bg-white/75 border border-amber-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="sex" className="block text-sm font-medium text-amber-800 dark:text-slate-300 mb-1">Sexo</label>
                  <select id="sex" name="sex" value={formData.sex} onChange={handleChange} className="block w-full px-3.5 py-2.5 text-base bg-white/75 border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-xl shadow-sm">
                    <option value="">Selecciona...</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Prefiero no decirlo</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-amber-800 dark:text-slate-300 mb-1">Peso (kg)</label>
                  <input type="number" name="weight" id="weight" value={formData.weight} onChange={handleChange} className="block w-full px-4 py-2.5 bg-white/75 border border-amber-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-amber-800 dark:text-slate-300 mb-1">Altura (cm)</label>
                  <input type="number" name="height" id="height" value={formData.height} onChange={handleChange} className="block w-full px-4 py-2.5 bg-white/75 border border-amber-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
                </div>
            </div>
             <div className="pt-5 flex justify-end items-center gap-4">
                {showSuccess && !isSaving && <p className="text-sm text-green-700 dark:text-green-400 animate-fade-in">¡Guardado con éxito!</p>}
                <button
                    type="submit"
                    disabled={!hasChanged || isSaving}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-700 disabled:opacity-50 disabled:cursor-wait transition-colors shadow-sm dark:bg-amber-500 dark:hover:bg-amber-600 min-w-[180px]"
                >
                    {isSaving ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : <SaveIcon />}
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
             </div>
        </form>

        <div className="mt-8 pt-6 border-t border-amber-200 dark:border-slate-700 space-y-6">
            <div>
                <h3 className="text-lg font-bold text-amber-950 dark:text-slate-100">Sincronización de Datos</h3>
                 {!isLoggedIn ? (
                     <div className="mt-2 bg-yellow-50 dark:bg-yellow-900/40 p-4 rounded-lg border border-yellow-200 dark:border-yellow-500/30 flex items-start gap-3">
                         <div className="text-yellow-600 dark:text-yellow-400 pt-1 flex-shrink-0"><InfoIcon /></div>
                         <div>
                             <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">Estás operando como invitado.</p>
                             <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                Tus datos se guardan solo en este dispositivo. Inicia sesión para sincronizar tu progreso en la nube y acceder desde cualquier lugar.
                             </p>
                         </div>
                     </div>
                 ) : (
                     <div className="mt-2 bg-green-50 dark:bg-green-900/40 p-4 rounded-lg border border-green-200 dark:border-green-500/30 flex items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                             <div className="text-green-600 dark:text-green-400 flex-shrink-0"><CheckCircleIcon /></div>
                             <div>
                                <p className="text-sm font-semibold text-green-800 dark:text-green-200">¡Todo Sincronizado!</p>
                                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                                    Tu plan y progreso están guardados de forma segura en tu cuenta.
                                 </p>
                             </div>
                        </div>
                        <button onClick={onLogout} className="text-xs font-semibold text-red-800 bg-red-100 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-200 dark:hover:bg-red-500/30 px-3 py-1.5 rounded-md transition-colors flex-shrink-0">
                            Cerrar Sesión
                        </button>
                     </div>
                 )}
            </div>
            <div>
                <h3 className="text-lg font-bold text-amber-950 dark:text-slate-100">Preferencias</h3>
                 <div className="mt-4">
                    <DarkModeToggle theme={theme} setTheme={setTheme} />
                </div>
            </div>
             <div>
                <h3 className="text-lg font-bold text-amber-950 dark:text-slate-100">Acciones del Plan</h3>
                <p className="mt-1 text-sm text-amber-800 dark:text-slate-400">La vida cambia, tu plan también puede hacerlo. Reajusta tu entrenamiento con base en tu progreso o nuevos objetivos.</p>
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={onInitiateReadjust}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-amber-900 rounded-xl hover:bg-amber-950 transition-colors shadow-sm dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-50"
                    >
                        <AdjustIcon />
                        {isSubscribed ? 'Reajustar Plan (Incluido)' : 'Reajustar Plan de Entrenamiento'}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default React.memo(ProfileView);