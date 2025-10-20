import React from 'react';
import { PlanInfo } from '../types';
import { PLANS } from '../constants';
import { CheckCircleIcon, StarIcon, InfoIcon } from './IconComponents';

const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);

const PlanCard: React.FC<{ plan: PlanInfo }> = ({ plan }) => {
    const isFree = plan.price === 0;
    return (
        <div className={`p-5 rounded-2xl border-2 flex flex-col ${plan.highlight ? 'border-amber-600 bg-amber-50/50 dark:border-amber-500 dark:bg-slate-700/40' : 'border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800/50'} relative`}>
            {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="inline-flex items-center gap-1.5 bg-amber-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md dark:bg-amber-500"><StarIcon /> Recomendado</span>
                </div>
            )}
            <h3 className="text-lg font-bold text-amber-900 text-center dark:text-slate-100">{plan.name}</h3>
            <div className="text-center mt-3">
                <span className="text-3xl font-extrabold text-amber-950 dark:text-white">{isFree ? 'Gratis' : formatCurrency(plan.price)}</span>
                {!isFree && <span className="text-sm font-medium text-amber-600 ml-1 dark:text-amber-400">{plan.priceSuffix}</span>}
            </div>
            <p className="text-center text-xs text-amber-700 dark:text-slate-400 mt-2 h-10">{plan.description}</p>
            <ul className="mt-5 space-y-2 text-xs text-amber-700 dark:text-slate-300 flex-grow">
                {plan.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2"><CheckCircleIcon className="text-green-500 w-4 h-4 mt-0.5 flex-shrink-0" /><span>{benefit}</span></li>
                ))}
            </ul>
        </div>
    );
};

const PricingModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
        <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-6xl animate-fade-in-up max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-amber-200 dark:border-slate-700 flex-shrink-0">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-amber-950 dark:text-slate-100">Planes de Precios</h2>
                        <p className="text-sm text-amber-700 dark:text-slate-400 mt-1">Encuentra el plan perfecto para tu próximo desafío.</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-amber-400 hover:text-amber-600 rounded-full hover:bg-amber-100 transition-colors dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {PLANS.map(plan => <PlanCard key={plan.id} plan={plan} />)}
                </div>

                 <div className="mt-8 bg-blue-50 dark:bg-blue-900/40 p-4 rounded-lg border border-blue-200 dark:border-blue-500/30 flex items-start gap-3">
                     <div className="text-blue-600 dark:text-blue-400 pt-1 flex-shrink-0"><InfoIcon /></div>
                     <div>
                         <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">¿Cómo funciona el pago?</p>
                         <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                            Este es un panel informativo. Para comprar, primero inicia como invitado o con tu cuenta, selecciona tus deportes y configura tu objetivo. La aplicación te presentará automáticamente las opciones de pago que correspondan a tu elección.
                         </p>
                     </div>
                 </div>
            </div>

            <div className="p-4 bg-amber-50/60 dark:bg-slate-900/50 border-t border-amber-200 dark:border-slate-700 rounded-b-2xl flex justify-end flex-shrink-0">
                <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors shadow-sm dark:bg-amber-500 dark:hover:bg-amber-600">
                    Cerrar
                </button>
            </div>
        </div>
    </div>
  );
};

export default PricingModal;