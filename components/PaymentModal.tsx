import React, { useState, useEffect } from 'react';
import { PlanType, PlanInfo } from '../types';
import { LockIcon, StarIcon, CheckCircleIcon } from './IconComponents';
import { PLANS } from '../constants';
import { WOMPI_PUBLIC_KEY, GCF_PAYMENT_ENDPOINT, IS_TEST_MODE } from '../wompiConfig';

// Declaramos el tipo global para el widget de Wompi que se carga desde el script
// Esto le dice a TypeScript que espere que WompiCheckout exista en el objeto window.
declare global {
    interface Window {
        WompiCheckout: any;
    }
}

interface Props {
  type: 'initial' | 'readjust' | 'certificate' | null;
  onClose: () => void;
  onPaymentSuccess: (planType: PlanType) => void;
  planDurationInDays: number;
  numberOfSports: number;
  userEmail: string;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);

const PlanCard: React.FC<{
    plan: PlanInfo,
    onPay: (planType: PlanType) => void,
    isProcessing: boolean,
    currentSelection: PlanType | null,
    isWompiReady: boolean,
}> = ({ plan, onPay, isProcessing, currentSelection, isWompiReady }) => {
    const isThisProcessing = isProcessing && currentSelection === plan.id;
    let buttonText = `Pagar ${formatCurrency(plan.price)}`;
    if (plan.id === 'premium') buttonText = 'Suscribirme';
    if (plan.price === 0) buttonText = 'Empezar Gratis';

    return (
        <div className={`p-6 rounded-2xl border-2 flex flex-col ${plan.highlight ? 'border-amber-600 bg-amber-50/50 dark:border-amber-500 dark:bg-slate-700/40' : 'border-amber-300 bg-white/60 dark:border-slate-600 dark:bg-slate-800/50'} relative`}>
            {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="inline-flex items-center gap-1.5 bg-amber-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md dark:bg-amber-500"><StarIcon /> Recomendado</span>
                </div>
            )}
            <h3 className="text-xl font-bold text-amber-900 text-center dark:text-slate-100">{plan.name}</h3>
            <div className="text-center mt-3">
                <span className="text-4xl font-extrabold text-amber-950 dark:text-white">{plan.price > 0 ? formatCurrency(plan.price) : 'Gratis'}</span>
                {plan.price > 0 && <span className="text-base font-medium text-amber-600 ml-1 dark:text-amber-400">{plan.priceSuffix}</span>}
            </div>
            <ul className="mt-6 space-y-3 text-sm text-amber-700 dark:text-slate-300 flex-grow">
                {plan.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3"><CheckCircleIcon className="text-green-500 w-4 h-4 flex-shrink-0 mt-0.5" /><span>{benefit}</span></li>
                ))}
            </ul>
            <button
                onClick={() => onPay(plan.id)}
                disabled={(plan.price > 0 && !isWompiReady) || isProcessing}
                className={`w-full flex items-center justify-center mt-6 px-6 py-3 text-base font-semibold rounded-xl transition-colors shadow-sm disabled:cursor-wait disabled:opacity-70 ${plan.highlight ? 'text-white bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 dark:bg-amber-500 dark:hover:bg-amber-600' : 'text-amber-900 bg-white hover:bg-amber-100 border border-amber-300 disabled:bg-amber-50 dark:text-slate-100 dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600'}`}
            >
                {plan.price > 0 && <LockIcon />}
                <span className={`${plan.price > 0 ? 'ml-2' : ''}`}>
                    {plan.price > 0 && !isWompiReady ? 'Cargando...' : (isThisProcessing ? 'Procesando...' : buttonText)}
                </span>
            </button>
        </div>
    );
};


const PaymentModal: React.FC<Props> = ({ type, onClose, onPaymentSuccess, planDurationInDays, numberOfSports, userEmail }) => {
  const [processingPlan, setProcessingPlan] = useState<PlanType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWompiReady, setIsWompiReady] = useState(false);

  // --- REFACTORIZACIÓN PROFESIONAL DEL SCRIPT DE CARGA ---
  useEffect(() => {
    // Función para cargar el script de forma segura.
    const loadWompiScript = () => {
      // Si Wompi ya está cargado en la ventana, marcamos como listo y terminamos.
      if (window.WompiCheckout) {
        setIsWompiReady(true);
        return;
      }

      // Si el script ya está en el DOM (quizás por otro modal), no lo añadimos de nuevo.
      const scriptId = 'wompi-checkout-script';
      if (document.getElementById(scriptId)) {
        // En este caso, esperamos a que ese script existente termine de cargar.
        // Se puede añadir un listener a ese script existente o usar un intervalo,
        // pero la solución más simple es confiar en que se cargará.
        return;
      }
      
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://checkout.wompi.co/widget.js';
      script.async = true; // Cargamos de forma asíncrona y confiamos en el evento 'load'.
      
      const handleLoad = () => {
        console.log("Wompi script cargado exitosamente.");
        setIsWompiReady(true);
      };
      
      const handleError = () => {
        console.error('Fallo al cargar el script de Wompi.');
        setError("Error crítico: No se pudo cargar el componente de pago. Por favor, refresca la página e inténtalo de nuevo.");
      };

      script.addEventListener('load', handleLoad);
      script.addEventListener('error', handleError);
      
      document.head.appendChild(script);

      // Función de limpieza: se ejecuta cuando el componente se desmonta.
      return () => {
        script.removeEventListener('load', handleLoad);
        script.removeEventListener('error', handleError);
      };
    };

    loadWompiScript();
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez, cuando el modal se monta.

  const getPlanPrice = (planType: PlanType): number => {
    if (type === 'certificate' && planType !== 'premium') {
        return 6000; // Special price for one-time certificate
    }
    const plan = PLANS.find(p => p.id === planType);
    return plan ? plan.price : 0;
  };

  const handlePay = async (planType: PlanType) => {
    setError(null);
    setProcessingPlan(planType);
    
    if (planType === 'free') {
        onPaymentSuccess('free');
        return;
    }

    // --- GUARDIA DEFENSIVA CONTRA CONDICIONES DE CARRERA ---
    // Aunque el botón está deshabilitado, hacemos una doble verificación aquí
    // para garantizar que WompiCheckout exista en el momento exacto del clic.
    if (!isWompiReady || typeof window.WompiCheckout === 'undefined') {
        setError("El checkout de pago no está listo. Por favor, espera un momento y vuelve a intentarlo.");
        setProcessingPlan(null);
        console.error("handlePay fue llamado, pero WompiCheckout no está definido en window.");
        return;
    }

    const isTestMode = IS_TEST_MODE;

    if (planType === 'premium') {
      // --- FLUJO DE SUSCRIPCIÓN ROBUSTO: TOKENIZACIÓN EXPLÍCITA ---
      try {
          const checkout = new window.WompiCheckout({
              publicKey: WOMPI_PUBLIC_KEY,
              operation: 'tokenize',
              customerData: {
                  email: userEmail,
              }
          });

          checkout.open(async function (result: any) {
              if (result.error) {
                  setError(`Error al registrar la tarjeta: ${result.error.reason || 'Intenta de nuevo.'}`);
                  setProcessingPlan(null);
                  return;
              }
              
              const cardToken = result.token.id;
              
              try {
                  const price = getPlanPrice(planType);
                  const amountInCents = price * 100;
                  const reference = `smaiflow-premium-initial-${new Date().getTime()}`;

                  const response = await fetch(GCF_PAYMENT_ENDPOINT, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        action: 'setup-and-charge-subscription',
                        data: {
                          token: cardToken,
                          customer_email: userEmail,
                          amountInCents: amountInCents,
                          reference: reference,
                        },
                        isTestMode: isTestMode,
                      }),
                  });

                  if (!response.ok) {
                      const errorData = await response.json();
                      throw new Error(errorData.error || 'El servidor rechazó la solicitud de suscripción.');
                  }
                  
                  const transactionResult = await response.json();
                  
                  if (transactionResult.status === 'APPROVED') {
                      onPaymentSuccess('premium');
                  } else {
                      throw new Error(`El pago inicial fue ${transactionResult.status?.toLowerCase() || 'rechazado'}. ${transactionResult.message || ''}`);
                  }

              } catch (backendError: any) {
                  console.error("Error llamando al backend para la suscripción:", backendError);
                  setError(backendError.message || 'No se pudo completar la suscripción. No se ha realizado ningún cobro.');
                  setProcessingPlan(null);
              }
          });

      } catch (err: any) {
           console.error("Error configurando Wompi para tokenización:", err);
           setError('No se pudo iniciar el proceso de pago. Revisa la consola.');
           setProcessingPlan(null);
      }

    } else {
        // --- FLUJO EXISTENTE PARA PAGOS ÚNICOS ---
        try {
            const price = getPlanPrice(planType);
            const amountInCents = price * 100;
            const reference = `smaiflow-${planType}-${new Date().getTime()}`;

            const signatureResponse = await fetch(GCF_PAYMENT_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  action: 'create-signature',
                  data: { reference, amountInCents },
                  isTestMode: isTestMode,
                }),
            });

            if (!signatureResponse.ok) {
                const errorData = await signatureResponse.json();
                throw new Error(errorData.error || 'No se pudo obtener la firma de integridad del servidor.');
            }
            const { signature } = await signatureResponse.json();
            
            const checkout = new window.WompiCheckout({
                currency: 'COP',
                amountInCents: amountInCents,
                reference: reference,
                publicKey: WOMPI_PUBLIC_KEY,
                signature: { integrity: signature },
                customerData: {
                    email: userEmail
                }
            });
            
            checkout.open(function (result: any) {
                if (result.transaction.status === 'APPROVED') {
                    onPaymentSuccess(planType);
                } else {
                    setError(`El pago fue ${result.transaction.status.toLowerCase()}. Por favor, intenta de nuevo.`);
                    setProcessingPlan(null);
                }
            });

        } catch (err: any) {
            console.error("Error al procesar el pago:", err);
            setError(err.message || 'Ocurrió un error inesperado. Revisa la consola para más detalles.');
            setProcessingPlan(null);
        }
    }
  };
  
  const getEligiblePlans = (): PlanInfo[] => {
    const eligible: PlanInfo[] = [];

    if (numberOfSports === 1 && planDurationInDays <= 29) {
        eligible.push(PLANS.find(p => p.id === 'free')!);
    }
    
    if (planDurationInDays <= 30) {
        if (numberOfSports === 1) {
            eligible.push(PLANS.find(p => p.id === 'bronze')!);
        } else if (numberOfSports === 2) {
            eligible.push(PLANS.find(p => p.id === 'silver')!);
        } else if (numberOfSports >= 3) { // Triathletes or more
            eligible.push(PLANS.find(p => p.id === 'gold')!);
        }
    }
    
    eligible.push(PLANS.find(p => p.id === 'premium')!);

    const uniquePlans = [...new Map(eligible.map(item => [item.id, item])).values()];
    return uniquePlans.sort((a, b) => a.price - b.price);
  };

  const renderContent = (content: React.ReactNode) => (
    <>
      {content}
      {error && (
        <div className="mt-4 p-3 text-sm text-red-800 bg-red-100 rounded-lg dark:bg-red-900/40 dark:text-red-300">
          <strong>Error:</strong> {error}
        </div>
      )}
    </>
  );

  const renderInitialPlanSelection = () => {
      const plansToShow = getEligiblePlans();
      return renderContent(
        <>
          <div className="text-center w-full">
              <h2 className="text-2xl font-bold text-amber-950 dark:text-slate-100">Elige tu Plan</h2>
              <p className="text-sm text-amber-700 mt-1 dark:text-slate-400">
                Basado en tu selección de {numberOfSports} deporte(s) y {planDurationInDays} días, estos son tus planes disponibles.
              </p>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-amber-400 hover:text-amber-600 rounded-full hover:bg-amber-100 transition-colors dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
    
          <div className={`mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
              {plansToShow.map(plan => (
                 <PlanCard 
                      key={plan.id}
                      plan={plan}
                      onPay={handlePay}
                      isProcessing={!!processingPlan}
                      currentSelection={processingPlan}
                      isWompiReady={isWompiReady}
                 />
              ))}
          </div>
        </>
      );
  }

  const renderCertificatePayment = () => {
    const oneTimePaymentPlan: PlanInfo = {
        id: 'bronze', // Using bronze as a placeholder type for one-time payment
        name: 'Pago Único',
        price: 6000,
        priceSuffix: 'COP',
        description: '',
        benefits: ['Descarga tu certificado de finalización.'],
    };
    const premiumPlan = PLANS.find(p => p.id === 'premium')!;

     return renderContent(
        <>
            <div className="text-center w-full">
                <h2 className="text-2xl font-bold text-amber-950 dark:text-slate-100">Desbloquea tu Certificado</h2>
                <p className="text-sm text-amber-700 mt-1 dark:text-slate-400">¡Felicidades! Elige una opción para obtener tu certificado.</p>
            </div>
            <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-amber-400 hover:text-amber-600 rounded-full hover:bg-amber-100 transition-colors dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <PlanCard
                    plan={oneTimePaymentPlan}
                    onPay={(planType) => handlePay(planType)}
                    isProcessing={!!processingPlan}
                    currentSelection={processingPlan}
                    isWompiReady={isWompiReady}
                />
                 <PlanCard
                    plan={premiumPlan}
                    onPay={handlePay}
                    isProcessing={!!processingPlan}
                    currentSelection={processingPlan}
                    isWompiReady={isWompiReady}
                />
            </div>
        </>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-4xl animate-fade-in-up">
        <div className="p-6 sm:p-8">
            {type === 'certificate' ? renderCertificatePayment() : renderInitialPlanSelection()}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
