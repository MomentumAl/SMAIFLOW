import React from 'react';
import { UserData, Sport } from '../types';

interface Props {
  data: UserData;
  onDataChange: (data: Partial<UserData>) => void;
  errors: { [key: string]: string };
  sports: Sport[];
}

const Step1Profile: React.FC<Props> = ({ data, onDataChange, errors, sports }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['age', 'weight', 'height'].includes(name);
    onDataChange({ [name]: isNumeric ? (value === '' ? '' : Number(value)) : value });
  };
  
  const sportNames = sports.map(sport => ({
      running: 'Running',
      natacion: 'Natación',
      ciclismo: 'Ciclismo'
  }[sport])).join(', ');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">📝 Tu Perfil Básico <span className="text-amber-700 dark:text-amber-300 font-semibold">({sportNames})</span></h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Empecemos con algunos datos básicos para personalizar tu experiencia.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">Nombre</label>
          <input 
            type="text" 
            name="name" 
            id="name" 
            value={data.name} 
            onChange={handleChange} 
            className={`block w-full px-4 py-2.5 text-slate-900 bg-white placeholder:text-slate-500 border rounded-xl shadow-sm focus:outline-none focus:ring-2 sm:text-sm ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-amber-300 focus:ring-amber-500 focus:border-amber-500'}`} 
            placeholder="Tu nombre" 
            aria-invalid={!!errors.name}
            aria-describedby="name-error"
          />
           {errors.name && <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">Email</label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            value={data.email} 
            onChange={handleChange} 
            className={`block w-full px-4 py-2.5 text-slate-900 bg-white placeholder:text-slate-500 border rounded-xl shadow-sm focus:outline-none focus:ring-2 sm:text-sm ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-amber-300 focus:ring-amber-500 focus:border-amber-500'}`} 
            placeholder="tu@email.com" 
            aria-invalid={!!errors.email}
            aria-describedby="email-error"
          />
          {errors.email && <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">Edad</label>
          <input 
            type="number" 
            name="age" 
            id="age" 
            value={data.age} 
            onChange={handleChange} 
            className={`block w-full px-4 py-2.5 text-slate-900 bg-white placeholder:text-slate-500 border rounded-xl shadow-sm focus:outline-none focus:ring-2 sm:text-sm ${errors.age ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-amber-300 focus:ring-amber-500 focus:border-amber-500'}`} 
            placeholder="30" 
            aria-invalid={!!errors.age}
            aria-describedby="age-error"
          />
          {errors.age && <p id="age-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.age}</p>}
        </div>
        <div>
          <label htmlFor="sex" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">Sexo</label>
          <select 
            id="sex" 
            name="sex" 
            value={data.sex} 
            onChange={handleChange} 
            className={`block w-full px-3.5 py-2.5 bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-2 sm:text-sm ${data.sex ? 'text-slate-900' : 'text-slate-500'} ${errors.sex ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-amber-300 focus:ring-amber-500 focus:border-amber-500'}`}
            aria-invalid={!!errors.sex}
            aria-describedby="sex-error"
          >
            <option value="">Selecciona...</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Prefiero no decirlo</option>
          </select>
          {errors.sex && <p id="sex-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.sex}</p>}
        </div>
        <div>
          <label htmlFor="weight" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">Peso (kg)</label>
          <input 
            type="number" 
            name="weight" 
            id="weight" 
            value={data.weight} 
            onChange={handleChange} 
            className={`block w-full px-4 py-2.5 text-slate-900 bg-white placeholder:text-slate-500 border rounded-xl shadow-sm focus:outline-none focus:ring-2 sm:text-sm ${errors.weight ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-amber-300 focus:ring-amber-500 focus:border-amber-500'}`} 
            placeholder="70" 
            aria-invalid={!!errors.weight}
            aria-describedby="weight-error"
          />
          {errors.weight && <p id="weight-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.weight}</p>}
        </div>
        <div>
          <label htmlFor="height" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">Altura (cm)</label>
          <input 
            type="number" 
            name="height" 
            id="height" 
            value={data.height} 
            onChange={handleChange} 
            className={`block w-full px-4 py-2.5 text-slate-900 bg-white placeholder:text-slate-500 border rounded-xl shadow-sm focus:outline-none focus:ring-2 sm:text-sm ${errors.height ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-amber-300 focus:ring-amber-500 focus:border-amber-500'}`} 
            placeholder="175"
            aria-invalid={!!errors.height}
            aria-describedby="height-error"
          />
          {errors.height && <p id="height-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.height}</p>}
        </div>
      </div>
    </div>
  );
};

export default Step1Profile;