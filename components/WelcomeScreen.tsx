import React, { useState } from 'react';
import { SmaiFlowLogoFullGold, GoogleIcon } from './IconComponents';

interface Props {
  onGoogleLogin: (marketingConsent: boolean) => void;
  onContinueAsGuest: (marketingConsent: boolean) => void;
  onShowLegal: (type: 'terms' | 'privacy') => void;
}

const WelcomeScreen: React.FC<Props> = ({ onGoogleLogin, onContinueAsGuest, onShowLegal }) => {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [marketingAccepted, setMarketingAccepted] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto text-center animate-fade-in-up">
      <div className="bg-slate-900/60 backdrop-blur-md p-8 sm:p-12 rounded-2xl border border-white/20 shadow-2xl">
        <SmaiFlowLogoFullGold className="w-56 h-auto mx-auto" />
        <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
          Predice Tu Grandeza
        </h1>
        <p className="mt-4 text-base text-amber-50 max-w-xl mx-auto leading-relaxed [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
          Tu compañero de IA que adapta dinámicamente tu entrenamiento para que alcances tu máximo potencial.
        </p>
        
        <div className="mt-8 space-y-4 text-left">
             <div className="relative flex items-start p-3 rounded-lg border border-amber-300/60 bg-white/5">
                <div className="flex items-center h-5 mt-0.5">
                    <input
                        id="terms-consent"
                        name="terms-consent"
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="h-5 w-5 rounded border-amber-400 text-amber-600 focus:ring-amber-500 bg-transparent"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="terms-consent" className="font-medium text-slate-100">
                        (Obligatorio) He leído y acepto los{' '}
                        <button onClick={() => onShowLegal('terms')} className="font-semibold text-amber-400 hover:underline">Términos y Condiciones</button>
                        {' '}y la{' '}
                        <button onClick={() => onShowLegal('privacy')} className="font-semibold text-amber-400 hover:underline">Política de Privacidad</button>.
                    </label>
                    <p className="text-slate-300 mt-1 text-xs leading-tight">
                        Entiendo que proporcionaré datos sensibles y autorizo su tratamiento para generar mi plan de entrenamiento.
                    </p>
                </div>
            </div>

            <div className="relative flex items-start p-3 rounded-lg border border-slate-600/80 bg-white/5">
                <div className="flex items-center h-5 mt-0.5">
                    <input
                        id="marketing-consent"
                        name="marketing-consent"
                        type="checkbox"
                        checked={marketingAccepted}
                        onChange={(e) => setMarketingAccepted(e.target.checked)}
                        className="h-5 w-5 rounded border-slate-400 text-amber-600 focus:ring-amber-500 bg-transparent"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="marketing-consent" className="font-medium text-slate-100">
                        (Opcional) Me gustaría recibir correos con noticias y promociones.
                    </label>
                    <p className="text-slate-300 mt-1 text-xs leading-tight">
                        Te enviaremos información sobre nuevas funcionalidades y ofertas de SmaiFlow. Puedes darte de baja en cualquier momento.
                    </p>
                </div>
            </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            onClick={() => onGoogleLogin(marketingAccepted)}
            disabled={!termsAccepted}
            className="w-full max-w-sm flex items-center justify-center gap-3 px-4 py-3 text-base font-semibold text-slate-800 bg-white rounded-xl hover:bg-slate-200 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <GoogleIcon className="w-5 h-5" />
            <span>Continuar con Google</span>
          </button>
          
          <button
            onClick={() => onContinueAsGuest(marketingAccepted)}
            disabled={!termsAccepted}
            className="w-full max-w-sm px-8 py-3 font-semibold text-amber-100 bg-white/10 hover:bg-white/20 rounded-xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar como Invitado
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;