import React, { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { AppState, UserData, Sport, TrainingPlanData, WorkoutStatus, AppView, ReadjustmentFeedback, Workout, PerceivedEffort, PlanType, FlowScore, DailyCheckInData, FlowScoreHistoryEntry, PlanAnalysis } from './types';
import { INITIAL_USER_DATA, FORM_STEPS, SPORT_NAMES } from './constants';
import { generateTrainingPlan, generateRecoveryWorkout } from './services/geminiService';
import { supabase } from './supabaseClient';
// FIX: Import legal content constants to resolve missing name errors.
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from './legalContent';

// Import Components
import Header from './components/Header';
import Footer from './components/Footer';
import SportSelection from './components/SportSelection';
import StepIndicator from './components/StepIndicator';
import Step1Profile from './components/Step1_Profile';
import Step2Experience from './components/Step2_Experience';
import Step3Fitness from './components/Step3_Fitness';
import LoadingScreen from './components/LoadingScreen';
import PaymentModal from './components/PaymentModal';
import LegalModal from './components/LegalModal';
import FeedbackModal from './components/FeedbackModal';
import ReadjustmentModal from './components/ReadjustmentModal';
import ConfirmationModal from './components/ConfirmationModal';
import BottomNavBar from './components/BottomNavBar';
import TodayView from './components/TodayView';
import WeekView from './components/WeekView';
import CalendarView from './components/CalendarView';
import StatsView from './components/StatsView';
import AchievementsView from './components/AchievementsView';
import ProfileView from './components/ProfileView';
import LogWorkoutModal from './components/LogWorkoutModal';
import InteractiveTour from './components/InteractiveTour';
import WelcomeScreen from './components/WelcomeScreen';
import ExperienceInfoModal from './components/ExperienceInfoModal';
import DailyCheckinModal from './components/DailyCheckinModal';
import CertificateModal from './components/CertificateModal';
import LoadingSpinner from './components/LoadingSpinner';
import PricingModal from './components/PricingModal';
import { AdjustIcon } from './components/IconComponents';


const App: React.FC = () => {
    // Main state
    const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
    const [userData, setUserData] = useState<UserData>(INITIAL_USER_DATA);
    const [trainingPlan, setTrainingPlan] = useState<TrainingPlanData | null>(null);
    const [planAnalysis, setPlanAnalysis] = useState<PlanAnalysis | null>(null);
    const [activePlanId, setActivePlanId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Form state
    const [formStep, setFormStep] = useState(0);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    // Modal states
    const [paymentTrigger, setPaymentTrigger] = useState<'initial' | 'readjust' | 'certificate' | null>(null);
    const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | null>(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [showPricingModal, setShowPricingModal] = useState(false);
    const [showReadjustModal, setShowReadjustModal] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showChangeSportsConfirm, setShowChangeSportsConfirm] = useState(false);
    const [showResumeConfirm, setShowResumeConfirm] = useState(false);
    const [workoutToLog, setWorkoutToLog] = useState<Workout | null>(null);
    const [readjustmentFeedback, setReadjustmentFeedback] = useState<ReadjustmentFeedback | null>(null);
    const [showFatigueWarning, setShowFatigueWarning] = useState(false);
    const [showExperienceInfoModal, setShowExperienceInfoModal] = useState(false);
    const [showCheckinModal, setShowCheckinModal] = useState(false);
    const [showEndOfPlanModal, setShowEndOfPlanModal] = useState(false);
    const [certificatePaid, setCertificatePaid] = useState(false);


    // Flow Score State
    const [todaysFlowScore, setTodaysFlowScore] = useState<FlowScore | null>(null);


    // Result view state
    const [activeView, setActiveView] = useState<AppView>('Hoy');
    
    // Tour state
    const [isTourOpen, setIsTourOpen] = useState(false);
    
    // Auth and State Management Effect
    useEffect(() => {
        const loadUserSession = async (currentSession: Session) => {
            const userId = currentSession.user.id;
            
            // 1. Fetch active training plan
            const { data: activePlan, error: planError } = await supabase
                .from('training_plans')
                .select('*')
                .eq('user_id', userId)
                .eq('is_active', true)
                .single();

            if (planError && planError.code !== 'PGRST116') { // PGRST116: 'No rows found'
                console.error("Error fetching training plan:", planError);
                setError("No se pudo cargar tu plan de entrenamiento desde la nube.");
                setAppState(AppState.ERROR);
                return;
            }
            
            if (activePlan) {
                // User has an active plan, load it
                setTrainingPlan(activePlan.plan_data);
                setUserData(activePlan.user_input_data);
                setActivePlanId(activePlan.id);
                setAppState(AppState.RESULT);
                
                const hasSeenTour = localStorage.getItem('smaiflow-tour-seen');
                if (!hasSeenTour) setIsTourOpen(true);

            } else {
                 // No active plan, fetch profile to populate form data
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();
                
                if (profileError && profileError.code !== 'PGRST116') {
                     console.error("Error fetching profile:", profileError);
                }
                
                const initialData = {
                    ...INITIAL_USER_DATA,
                    name: currentSession.user.user_metadata?.full_name || profile?.name || '',
                    email: currentSession.user.email || '',
                    age: profile?.age || '',
                    sex: profile?.sex || '',
                    weight: profile?.weight || '',
                    height: profile?.height || '',
                };
                setUserData(initialData);
                setAppState(AppState.SPORT_SELECTION);
            }
            
            // Fetch subscription status regardless
             const { data: profileSubscription, error: subError } = await supabase
                .from('profiles')
                .select('is_subscribed')
                .eq('id', userId)
                .single();
            if (profileSubscription) {
                setIsSubscribed(profileSubscription.is_subscribed);
            }
        };


        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            const userIsLoggedIn = !!session;
            setIsLoggedIn(userIsLoggedIn);
    
            if (userIsLoggedIn) {
                loadUserSession(session);
            } else { // User is a guest or logged out
                const savedFormData = localStorage.getItem('smaiflow-form-data');
                const savedFormStep = localStorage.getItem('smaiflow-form-step');
                if (savedFormData && savedFormStep) {
                    setShowResumeConfirm(true);
                } else {
                    setAppState(AppState.WELCOME);
                }
            }
        });
    
        return () => subscription.unsubscribe();
    }, []);
    
    // Load today's flow score from localStorage on app load
    useEffect(() => {
      const todayString = new Date().toISOString().split('T')[0];
      const lastCheckinDate = localStorage.getItem('smaiflow-last-checkin');
      if (lastCheckinDate === todayString) {
        const savedScore = localStorage.getItem('smaiflow-todays-score');
        if (savedScore) {
          setTodaysFlowScore(JSON.parse(savedScore));
        }
      }
    }, []);
    
    // Effect to trigger Daily Check-in Modal if needed, respecting the tour
    useEffect(() => {
        const shouldShowCheckin = () => {
            if (appState !== AppState.RESULT || activeView !== 'Hoy' || !trainingPlan) return false;
            if (isTourOpen) return false;
            
            const todayString = new Date().toISOString().split('T')[0];
            const lastCheckinDate = localStorage.getItem('smaiflow-last-checkin');
            if (lastCheckinDate === todayString) return false;

            return true;
        };

        if (shouldShowCheckin()) {
            setShowCheckinModal(true);
        }
    }, [appState, activeView, isTourOpen, trainingPlan]);

    // Effect to analyze the training plan whenever it changes
    useEffect(() => {
        if (!trainingPlan || !userData) {
            setPlanAnalysis(null);
            return;
        }

        const allWorkouts = trainingPlan.plan.flatMap(week => week.workouts);
        const relevantWorkouts = allWorkouts.filter(w => !w.type.toLowerCase().includes('descanso'));
        const completedWorkouts = relevantWorkouts.filter(w => w.status === 'completed');

        const completionRate = relevantWorkouts.length > 0 ? (completedWorkouts.length / relevantWorkouts.length) * 100 : 0;
        
        const historyString = localStorage.getItem('smaiflow-flow-score-history');
        const flowScoreHistory: FlowScoreHistoryEntry[] = historyString ? JSON.parse(historyString) : [];
        const averageFlowScore = flowScoreHistory.length > 0 ? flowScoreHistory.reduce((acc, entry) => acc + entry.score, 0) / flowScoreHistory.length : 0;

        const planEndDate = allWorkouts[allWorkouts.length - 1]?.date;
        const isFinished = planEndDate ? new Date() > new Date(planEndDate) : false;

        const qualifiesForCertificate = completionRate >= 90 && averageFlowScore >= 85;

        // Stats
        const totalDurationMinutes = completedWorkouts.reduce((acc, w) => acc + (w.duration || 0), 0);
        const totalDistanceKm = completedWorkouts.reduce((acc, w) => acc + (w.distance || 0), 0);
        const averagePaceMinPerKm = totalDistanceKm > 0 && totalDurationMinutes > 0 ? totalDurationMinutes / totalDistanceKm : null;
        const planStartDate = allWorkouts[0]?.date;
        const planDurationDays = planStartDate && planEndDate ? (new Date(planEndDate).getTime() - new Date(planStartDate).getTime()) / (1000 * 3600 * 24) + 1 : 0;
        
        setPlanAnalysis({
            completionRate,
            averageFlowScore,
            isFinished,
            qualifiesForCertificate,
            completedCount: completedWorkouts.length,
            skippedCount: relevantWorkouts.filter(w => w.status === 'skipped').length,
            totalDurationMinutes,
            totalDistanceKm,
            totalElevationMeters: completedWorkouts.reduce((acc, w) => acc + (w.elevation || 0), 0),
            planDurationDays,
            totalHours: Math.round(totalDurationMinutes / 60),
            goalDistances: Object.values(userData.goals).join(', '),
            averagePaceMinPerKm,
        });

    }, [trainingPlan, userData]);


     // Auto-save form progress for guests
    useEffect(() => {
        if (appState === AppState.FORM && !isLoggedIn) {
            try {
                localStorage.setItem('smaiflow-form-data', JSON.stringify(userData));
                localStorage.setItem('smaiflow-form-step', JSON.stringify(formStep));
            } catch (e) {
                console.error("Failed to save form progress to localStorage", e);
            }
        }
    }, [userData, formStep, appState, isLoggedIn]);

    // Save state to localStorage for GUESTS ONLY
    const saveGuestState = useCallback((state: AppState, user: UserData, plan: TrainingPlanData | null, subscription: boolean) => {
        if (isLoggedIn) return; // Do not save to localStorage for logged-in users
        try {
            if (state === AppState.WELCOME) return;
            localStorage.setItem('smaiflow-app-state', JSON.stringify(state));
            localStorage.setItem('smaiflow-user-data', JSON.stringify(user));
            if(plan) localStorage.setItem('smaiflow-training-plan', JSON.stringify(plan));
            localStorage.setItem('smaiflow-subscription-status', JSON.stringify(subscription));
        } catch (e) {
            console.error("Failed to save guest state to localStorage", e);
        }
    }, [isLoggedIn]);
    
    // Effect for theme changes and background image
    useEffect(() => {
        const isDark = theme === 'dark';
        if (isDark) {
            document.documentElement.classList.add('dark');
            document.body.style.backgroundImage = "url('https://iili.io/KjSxR0G.jpg')";
        } else {
            document.documentElement.classList.remove('dark');
            document.body.style.backgroundImage = "url('https://iili.io/KjJFkmb.jpg')";
        }
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    const clearFormProgress = () => {
        localStorage.removeItem('smaiflow-form-data');
        localStorage.removeItem('smaiflow-form-step');
    };

    const handleResume = () => {
        const savedFormData = localStorage.getItem('smaiflow-form-data');
        const savedFormStep = localStorage.getItem('smaiflow-form-step');
        if (savedFormData && savedFormStep) {
            setUserData(JSON.parse(savedFormData));
            setFormStep(JSON.parse(savedFormStep));
            setAppState(AppState.FORM);
        }
        setShowResumeConfirm(false);
    };

    const handleDiscardResume = () => {
        clearFormProgress();
        setShowResumeConfirm(false);
        setAppState(AppState.WELCOME);
    };


    const handleDataChange = (data: Partial<UserData>) => {
        setUserData(prev => ({ ...prev, ...data }));
    };
    
    const handleGoogleLogin = async (marketingConsent: boolean) => {
        setUserData(prev => ({ ...prev, allowMarketing: marketingConsent }));
        setIsLoggingIn(true);
        clearFormProgress();
        
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        });
        if (error) {
            console.error('Error logging in with Google:', error.message);
            setError('No se pudo iniciar sesión con Google. Inténtalo de nuevo.');
            setAppState(AppState.ERROR);
            setIsLoggingIn(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        // The onAuthStateChange listener will handle resetting the state
        localStorage.clear(); // Clear all local storage on logout
        setUserData(INITIAL_USER_DATA);
        setTrainingPlan(null);
        setActivePlanId(null);
        setAppState(AppState.WELCOME);
        setFormStep(0);
        setIsSubscribed(false);
        setSession(null);
        setIsLoggedIn(false);
    };

    const handleContinueAsGuest = (marketingConsent: boolean) => {
       setUserData(prev => ({ ...prev, allowMarketing: marketingConsent }));
       setIsLoggedIn(false);
       setAppState(AppState.SPORT_SELECTION);
    };

    const handleConfirmSelection = (sports: Sport[]) => {
        setUserData(prev => ({ ...prev, selectedSports: sports, sportDistribution: sports.length > 0 ? sports.reduce((acc, sport) => ({...acc, [sport]: Math.round(100/sports.length)}), {}) : {} }));
        setAppState(AppState.FORM);
    };

    const validateStep = (step: number): boolean => {
        const newErrors: { [key: string]: string } = {};
        switch (step) {
            case 0: // Profile
                if (!userData.name.trim()) newErrors.name = 'El nombre es obligatorio.';
                if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
                    newErrors.email = 'Por favor, introduce un email válido.';
                }
                if (!userData.age) {
                    newErrors.age = 'La edad es obligatoria.';
                } else if (userData.age < 12 || userData.age > 100) {
                    newErrors.age = 'La edad debe estar entre 12 y 100.';
                }
                if (!userData.sex) newErrors.sex = 'El sexo es obligatorio.';
                if (!userData.weight) {
                    newErrors.weight = 'El peso es obligatorio.';
                } else if (userData.weight < 30 || userData.weight > 200) {
                    newErrors.weight = 'El peso debe ser un valor realista.';
                }
                if (!userData.height) {
                    newErrors.height = 'La altura es obligatoria.';
                } else if (userData.height < 100 || userData.height > 250) {
                    newErrors.height = 'La altura debe ser un valor realista.';
                }
                break;
            case 1: // Experience & Goals
                if (!userData.experience) newErrors.experience = 'Debes seleccionar tu nivel de experiencia.';
                
                userData.selectedSports.forEach(sport => {
                    if (!userData.goals[sport]) {
                        newErrors[`goal_${sport}`] = `Debes seleccionar un objetivo para ${SPORT_NAMES[sport]}.`;
                    }
                });
                break;
            case 2: // Fitness & Availability
                if (!userData.raceDate) {
                    newErrors.raceDate = 'Debes seleccionar una fecha de competición.';
                } else if (userData.planStartDate && new Date(userData.raceDate) <= new Date(userData.planStartDate)) {
                    newErrors.raceDate = 'La fecha de competición debe ser posterior a la fecha de inicio.';
                }
                
                if (!userData.trainingDays) newErrors.trainingDays = 'Debes seleccionar cuántos días entrenarás.';
                break;
        }
        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => {
        if (validateStep(formStep)) {
            setFormStep(prev => prev + 1);
        }
    };
    const handlePrevStep = () => setFormStep(prev => prev - 1);
    
    const calculateWeeks = () => {
        if (!userData.raceDate || !userData.planStartDate) return null;
        const start = new Date(userData.planStartDate);
        const end = new Date(userData.raceDate);
        if (end <= start) return null;
        const diffTime = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    };

    const calculateDays = () => {
        if (!userData.raceDate) return 30; // Default to 30 days if no race date is set, though validation requires it
        const startStr = userData.planStartDate || new Date().toISOString().split('T')[0];
        const start = new Date(startStr);
        const end = new Date(userData.raceDate);
        if (end <= start) return 30; // Default if date is invalid
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };
    
    const executePlanGeneration = async (dataForPlan: UserData, feedbackForReadjust?: ReadjustmentFeedback) => {
        setError(null);
        setAppState(AppState.LOADING);
        
        try {
            const plan = await generateTrainingPlan(dataForPlan, feedbackForReadjust ? trainingPlan : null, feedbackForReadjust);
            setTrainingPlan(plan);
            setUserData(dataForPlan); // Update state with the data used for generation (e.g., modified raceDate)
            setAppState(AppState.RESULT);

            if (isLoggedIn && session) {
                // Deactivate old plans
                await supabase.from('training_plans').update({ is_active: false }).eq('user_id', session.user.id);

                // Insert the new plan
                const { data: newPlan, error: insertError } = await supabase
                    .from('training_plans')
                    .insert({
                        user_id: session.user.id,
                        plan_data: plan,
                        user_input_data: dataForPlan,
                        is_active: true
                    })
                    .select('id')
                    .single();
                
                if(insertError) throw insertError;
                if(newPlan) setActivePlanId(newPlan.id);

            } else {
                saveGuestState(AppState.RESULT, dataForPlan, plan, isSubscribed);
            }

            clearFormProgress();
            localStorage.removeItem('smaiflow-last-checkin');
            localStorage.removeItem('smaiflow-todays-score');
            localStorage.removeItem('smaiflow-flow-score-history');
            setTodaysFlowScore(null);
            
            if(!localStorage.getItem('smaiflow-tour-seen')) {
                setActiveView('Hoy');
                setIsTourOpen(true);
            }
        } catch (e: any) {
            console.error("Error during plan generation/saving:", e);
            setError(e.message || "Ocurrió un error inesperado al generar o guardar tu plan.");
            setAppState(AppState.ERROR);
        }
    };

    const handleSubmit = async (feedbackForReadjust?: ReadjustmentFeedback) => {
        if (validateStep(formStep) || feedbackForReadjust) {
            const finalUserData = { ...userData };
            if (!finalUserData.planStartDate) {
                finalUserData.planStartDate = new Date().toISOString().split('T')[0];
            }
            await executePlanGeneration(finalUserData, feedbackForReadjust);
        }
    };
    
    const handlePaymentSuccess = (planType: PlanType) => {
        if (planType === 'premium') {
            setIsSubscribed(true);
            if (session) {
                supabase.from('profiles').update({ is_subscribed: true }).eq('id', session.user.id).then();
            }
        }

        if (paymentTrigger === 'certificate') {
            setCertificatePaid(true);
            setPaymentTrigger(null);
            setShowEndOfPlanModal(true); // Re-open the certificate modal
            return;
        }
        
        // Prepare user data for generation
        let dataForPlan = { ...userData, planType };
        if (!dataForPlan.planStartDate) {
            dataForPlan.planStartDate = new Date().toISOString().split('T')[0];
        }

        // If it's an initial premium plan AND the user hasn't set a specific race date, set duration to 1 year.
        if (paymentTrigger === 'initial' && planType === 'premium' && !dataForPlan.raceDate) {
            const startDate = new Date(dataForPlan.planStartDate);
            const oneYearLater = new Date(startDate);
            oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
            dataForPlan.raceDate = oneYearLater.toISOString().split('T')[0];
        }
        
        if (paymentTrigger === 'initial') {
            executePlanGeneration(dataForPlan);
        } else if (paymentTrigger === 'readjust' && readjustmentFeedback) {
            executePlanGeneration(dataForPlan, readjustmentFeedback);
        }

        setPaymentTrigger(null);
        setReadjustmentFeedback(null);
    };

    const handleInitiatePlanGeneration = () => {
        if (validateStep(formStep)) {
            setPaymentTrigger('initial');
        }
    };

    const handleInitiateReadjust = () => {
        setShowReadjustModal(true);
    };
    
    const handleInitiateCertificatePayment = () => {
        setShowEndOfPlanModal(false); // Close certificate modal
        setPaymentTrigger('certificate'); // Open payment modal
    };

    const handleConfirmReadjust = (feedback: ReadjustmentFeedback) => {
        setShowReadjustModal(false);
        setReadjustmentFeedback(feedback);
        // Bypassing payment for readjustment for now, can be enabled by setting trigger
        executePlanGeneration(userData, feedback);
    };

    const handleUpdateWorkoutStatus = async (workoutId: string, status: WorkoutStatus) => {
        if (!trainingPlan) return;
        
        let updatedPlan = { ...trainingPlan };
    
        updatedPlan = {
            ...trainingPlan,
            plan: trainingPlan.plan.map(week => ({
                ...week,
                workouts: week.workouts.map(workout => {
                    if (workout.id === workoutId) {
                        if (status === 'completed' && !workout.perceivedEffort) {
                           setWorkoutToLog(workout);
                           return workout;
                        }
                        if (status !== 'completed') {
                            const { perceivedEffort, notes, distance, duration, elevation, ...rest } = workout;
                            return { ...rest, status };
                        }
                        return { ...workout, status };
                    }
                    return workout;
                })
            }))
        };
    
        setTrainingPlan(updatedPlan);
        
        if (isLoggedIn && activePlanId) {
            const { error } = await supabase
                .from('training_plans')
                .update({ plan_data: updatedPlan })
                .eq('id', activePlanId);
            if (error) console.error("Error updating workout status in DB:", error);
        } else {
            saveGuestState(appState, userData, updatedPlan, isSubscribed);
        }
    };
    
    const checkFatigue = (updatedPlan: TrainingPlanData) => {
        const allWorkouts = updatedPlan.plan.flatMap(week => week.workouts);
        const completedWorkouts = allWorkouts
            .filter(w => w.status === 'completed' && w.perceivedEffort)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
        if (completedWorkouts.length >= 3) {
            const lastThree = completedWorkouts.slice(0, 3);
            if (lastThree.every(w => w.perceivedEffort === 'dificil')) {
                setShowFatigueWarning(true);
            }
        }
    };

    const handleLogWorkout = async (workoutId: string, effort: PerceivedEffort, notes: string, distance?: number, duration?: number, elevation?: number) => {
        if (!trainingPlan) return;
        const updatedPlan = {
            ...trainingPlan,
            plan: trainingPlan.plan.map(week => ({
                ...week,
                workouts: week.workouts.map(workout =>
                    workout.id === workoutId
                        ? { ...workout, status: 'completed' as WorkoutStatus, perceivedEffort: effort, notes, distance, duration, elevation }
                        : workout
                )
            }))
        };
        setTrainingPlan(updatedPlan);
        setWorkoutToLog(null);
        
        if (isLoggedIn && activePlanId) {
             const { error } = await supabase
                .from('training_plans')
                .update({ plan_data: updatedPlan })
                .eq('id', activePlanId);
            if (error) console.error("Error logging workout in DB:", error);
        } else {
            saveGuestState(appState, userData, updatedPlan, isSubscribed);
        }

        checkFatigue(updatedPlan);
    };
    
    const handleUpdateUserData = async (data: Partial<UserData>) => {
        const newUserData = { ...userData, ...data };
        setUserData(newUserData);
        if (session) {
            const { error } = await supabase.from('profiles').upsert({
                id: session.user.id,
                updated_at: new Date().toISOString(),
                name: newUserData.name,
                age: newUserData.age || null,
                sex: newUserData.sex || null,
                weight: newUserData.weight || null,
                height: newUserData.height || null,
            });
            if (error) {
                console.error("Error saving profile:", error);
                setError("No se pudo guardar tu perfil en la nube.");
            }
        }
    };

    const handleReset = async (confirmed = false) => {
        if (!confirmed) {
            setShowResetConfirm(true);
            return;
        }

        if (isLoggedIn && session) {
            await supabase
                .from('training_plans')
                .update({ is_active: false })
                .eq('user_id', session.user.id);
        }

        localStorage.removeItem('smaiflow-app-state');
        localStorage.removeItem('smaiflow-user-data');
        localStorage.removeItem('smaiflow-training-plan');
        localStorage.removeItem('smaiflow-last-checkin');
        localStorage.removeItem('smaiflow-todays-score');
        localStorage.removeItem('smaiflow-flow-score-history');
        clearFormProgress();

        const baseUserData = {
            ...INITIAL_USER_DATA,
            name: session?.user?.user_metadata?.full_name || '',
            email: session?.user?.email || '',
        };

        setAppState(AppState.SPORT_SELECTION);
        setUserData(baseUserData);
        setTrainingPlan(null);
        setActivePlanId(null);
        setError(null);
        setFormStep(0);
        setShowResetConfirm(false);
        setTodaysFlowScore(null);
    };

    const handleFinishPlan = () => {
        setShowEndOfPlanModal(true);
    };
    
    const handleBackToSportSelection = () => {
        const baseUserData = {
            ...INITIAL_USER_DATA,
            name: session?.user?.user_metadata?.full_name || '',
            email: session?.user?.email || '',
        };
        setUserData(baseUserData);
        setFormStep(0);
        setFormErrors({});
        clearFormProgress();
        setAppState(AppState.SPORT_SELECTION);
        setShowChangeSportsConfirm(false);
    }
    
    // --- Flow Score Logic ---
    const calculateFlowScore = (data: DailyCheckInData): FlowScore => {
        const breakdown = {
            energy: (data.energy - 3) * 5,
            soreness: -(data.soreness - 1) * 5,
            sleep: (data.sleep - 3) * 6,
            stress: -(data.stress - 1) * 7,
            motivation: (data.motivation - 3) * 4,
        };

        let score = 100 + breakdown.energy + breakdown.soreness + breakdown.sleep + breakdown.stress + breakdown.motivation;
        
        score = Math.max(20, Math.min(100, Math.round(score)));

        let title = '';
        let message = '';
        let colorClass = '';

        if(score > 85) {
            title = 'Listo para la Grandeza';
            message = 'Tu cuerpo y mente están en sintonía perfecta. Hoy es un día para superar tus límites. ¡Ve a por todas!';
            colorClass = 'text-sky-500';
        } else if (score >= 60) {
            title = 'En Flujo Óptimo';
            message = 'Estás en un gran punto de equilibrio. El entrenamiento de hoy te ayudará a consolidar tu progreso. ¡Disfrútalo!';
            colorClass = 'text-green-500';
        } else if (score >= 45) {
            title = 'Escucha a tu Cuerpo';
            message = 'Hay señales de fatiga acumulada. Enfócate en la técnica y no fuerces el ritmo. La consistencia es la victoria de hoy.';
            colorClass = 'text-amber-500';
        } else {
            title = 'Recuperación Inteligente';
            message = 'Tu cuerpo te pide un respiro. Un entrenamiento ligero o un descanso es la decisión más inteligente. Descansar hoy es invertir en la victoria de mañana.';
            colorClass = 'text-red-500';
        }
        return { score, title, message, breakdown, colorClass };
    };

    const handleCheckinSubmit = (data: DailyCheckInData) => {
        const score = calculateFlowScore(data);
        const todayString = new Date().toISOString().split('T')[0];
        
        setTodaysFlowScore(score);
        localStorage.setItem('smaiflow-todays-score', JSON.stringify(score));
        localStorage.setItem('smaiflow-last-checkin', todayString);
    
        // Update flow score history
        try {
            const historyString = localStorage.getItem('smaiflow-flow-score-history');
            const history: FlowScoreHistoryEntry[] = historyString ? JSON.parse(historyString) : [];
            const newEntry: FlowScoreHistoryEntry = { date: todayString, score: score.score };
            
            // Remove today's entry if it already exists, then add the new one
            const updatedHistory = history.filter(entry => entry.date !== todayString);
            updatedHistory.push(newEntry);
            
            localStorage.setItem('smaiflow-flow-score-history', JSON.stringify(updatedHistory));
        } catch (e) {
            console.error("Failed to update flow score history:", e);
        }
    
        setShowCheckinModal(false);
    };
    
    const handleAdjustTodaysWorkout = async (originalWorkout: Workout, flowScore: FlowScore) => {
      if (!trainingPlan) return;
      try {
        const recoveryWorkout = await generateRecoveryWorkout(originalWorkout, flowScore);
        
        const newPlan = { ...trainingPlan };
        const weekIndex = newPlan.plan.findIndex(w => w.workouts.some(wo => wo.id === originalWorkout.id));
        if (weekIndex === -1) throw new Error("Workout week not found");
        
        const workoutIndex = newPlan.plan[weekIndex].workouts.findIndex(wo => wo.id === originalWorkout.id);
        if (workoutIndex === -1) throw new Error("Workout not found");

        // Replace the workout
        newPlan.plan[weekIndex].workouts[workoutIndex] = recoveryWorkout;
        setTrainingPlan(newPlan);

        // Persist change
        if (isLoggedIn && activePlanId) {
             await supabase.from('training_plans').update({ plan_data: newPlan }).eq('id', activePlanId);
        } else {
            saveGuestState(appState, userData, newPlan, isSubscribed);
        }
      } catch(e: any) {
         console.error("Error adjusting workout:", e);
         setError(e.message || "No se pudo ajustar el entrenamiento. Inténtalo más tarde.");
      }
    };


    const renderFormStep = () => {
        switch(formStep) {
            case 0:
                return <Step1Profile data={userData} onDataChange={handleDataChange} errors={formErrors} sports={userData.selectedSports} />;
            case 1:
                return <Step2Experience data={userData} onDataChange={handleDataChange} errors={formErrors} sports={userData.selectedSports} onShowInfo={() => setShowExperienceInfoModal(true)} />;
            case 2:
                return <Step3Fitness data={userData} onDataChange={handleDataChange} errors={formErrors} sports={userData.selectedSports} />;
            default:
                return null;
        }
    };

    const renderContent = () => {
        if (isLoggingIn) {
            return (
                <div className="text-center bg-amber-100/80 dark:bg-slate-800/80 backdrop-blur-md p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-4">
                    <LoadingSpinner />
                    <h2 className="text-xl font-bold text-amber-900 dark:text-slate-100">Redirigiendo a Google...</h2>
                    <p className="text-amber-800 dark:text-slate-300">Por favor, espera un momento.</p>
                </div>
            );
        }
        switch(appState) {
            case AppState.WELCOME:
                return <WelcomeScreen onGoogleLogin={handleGoogleLogin} onContinueAsGuest={handleContinueAsGuest} onShowLegal={setLegalModalType} />;
            case AppState.SPORT_SELECTION:
                return <SportSelection onConfirmSelection={handleConfirmSelection} />;
            case AppState.FORM:
                return (
                    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                        <StepIndicator currentStep={formStep} steps={FORM_STEPS} />
                        <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-6 sm:p-10 rounded-2xl shadow-lg border border-amber-300/40">
                            <button 
                                onClick={() => setShowChangeSportsConfirm(true)}
                                className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors shadow-sm border border-slate-300/60 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600"
                            >
                                <AdjustIcon className="h-4 w-4" />
                                Cambiar Deportes
                            </button>
                            {renderFormStep()}
                            <div className="mt-10 flex justify-between items-center">
                                <button
                                    onClick={handlePrevStep}
                                    disabled={formStep === 0}
                                    className="px-6 py-2.5 font-semibold text-slate-600 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    Atrás
                                </button>
                                {formStep < FORM_STEPS.length - 1 ? (
                                     <button
                                        onClick={handleNextStep}
                                        className="px-6 py-2.5 font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors shadow-md"
                                     >
                                        Siguiente
                                     </button>
                                ) : (
                                    <button
                                        onClick={handleInitiatePlanGeneration}
                                        className="px-6 py-2.5 font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors shadow-lg"
                                    >
                                        ¡Generar mi Plan!
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case AppState.LOADING:
                return <LoadingScreen selectedSports={userData.selectedSports} planDurationInWeeks={calculateWeeks()} />;
            case AppState.RESULT:
                if (!trainingPlan) {
                    setError("No se encontró un plan de entrenamiento. Por favor, crea uno nuevo.");
                    setAppState(AppState.ERROR);
                    return null;
                }
                const mainContent: Record<AppView, React.ReactNode> = {
                    'Hoy': <TodayView plan={trainingPlan} onUpdateWorkoutStatus={handleUpdateWorkoutStatus} userData={userData} todaysFlowScore={todaysFlowScore} onAdjustWorkout={handleAdjustTodaysWorkout} />,
                    'Semana': <WeekView plan={trainingPlan} userName={userData.name} isSubscribed={isSubscribed} onReset={() => handleReset(true)} onUpdateWorkoutStatus={handleUpdateWorkoutStatus} onInitiateReadjust={handleInitiateReadjust} userData={userData} onFinishPlan={handleFinishPlan} planAnalysis={planAnalysis} />,
                    'Calendario': <CalendarView plan={trainingPlan} userData={userData} />,
                    'Estadísticas': <StatsView plan={trainingPlan} userData={userData} planAnalysis={planAnalysis} />,
                    'Logros': <AchievementsView plan={trainingPlan} />,
                    'Perfil': <ProfileView userData={userData} onUpdate={handleUpdateUserData} onInitiateReadjust={handleInitiateReadjust} theme={theme} setTheme={setTheme} isSubscribed={isSubscribed} isLoggedIn={isLoggedIn} onLogout={handleLogout} />,
                };
                return (
                    <div className="md:pl-24 pb-20 md:pb-0 w-full animate-fade-in" key={activeView}>
                        {mainContent[activeView]}
                    </div>
                );
            case AppState.ERROR:
                return (
                    <div className="text-center bg-red-50 dark:bg-red-900/40 p-8 rounded-2xl shadow-lg border border-red-200 dark:border-red-500/30">
                        <h2 className="text-2xl font-bold text-red-800 dark:text-red-300">¡Ups! Algo salió mal</h2>
                        <p className="text-red-700 dark:text-red-400 mt-2 max-w-md mx-auto">
                            {error || "La IA está experimentando una alta demanda o se produjo un error de red. Por favor, intenta generar tu plan de nuevo en unos momentos."}
                        </p>
                        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                            <button onClick={() => handleSubmit()} className="px-6 py-2.5 font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700">
                                Reintentar
                            </button>
                             <button onClick={() => handleReset(true)} className="px-6 py-2 font-semibold text-red-800 bg-red-100 rounded-lg hover:bg-red-200 dark:bg-red-500/20 dark:text-red-200 dark:hover:bg-red-500/30">
                                Empezar de Nuevo
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    
    const tourSteps = [
      {
        position: 'center' as const,
        title: "¡Bienvenido/a a SmaiFlow!",
        content: "Esta es tu nueva central de entrenamiento. Permítenos mostrarte rápidamente las funciones clave."
      },
      {
        selector: '[data-tour-id="today-view-nav"]',
        position: 'right' as const,
        title: "Vista de 'Hoy'",
        content: "Aquí verás tu 'Flow Score' y tu entrenamiento del día. ¡Tu punto de partida diario!"
      },
      {
        selector: '[data-tour-id="today-complete-workout-btn"]',
        position: 'bottom' as const,
        title: "Completa tus Entrenamientos",
        content: "Después de cada sesión, márcala como '¡Hecho!' para registrar tu progreso y darnos feedback sobre cómo te sentiste."
      },
      {
        selector: '[data-tour-id="week-view-nav"]',
        position: 'right' as const,
        title: "Vista de 'Semana'",
        content: "Explora tu plan completo semana a semana. Aquí puedes ver el panorama general, navegar entre semanas y reajustar tu plan si es necesario."
      },
      {
        selector: '[data-tour-id="profile-view-nav"]',
        position: 'right' as const,
        title: "Tu Perfil",
        content: "Mantén tus datos actualizados aquí. También puedes cambiar a modo oscuro y reajustar tu plan en cualquier momento."
      },
      {
        position: 'center' as const,
        title: "¡Todo listo!",
        content: "Ya conoces lo básico. Explora las demás secciones como Calendario, Estadísticas y Logros para sacar el máximo provecho. ¡A entrenar!"
      },
    ];

    return (
        <div className="min-h-screen text-slate-800 dark:text-slate-200 flex flex-col">
            {appState !== AppState.WELCOME && <Header />}
            {appState === AppState.RESULT && <BottomNavBar activeView={activeView} setActiveView={setActiveView} />}
            <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 flex items-center justify-center">
                {renderContent()}
            </main>
            
            {/* Modals */}
            {paymentTrigger && (
                <PaymentModal
                    type={paymentTrigger}
                    onClose={() => setPaymentTrigger(null)}
                    onPaymentSuccess={handlePaymentSuccess}
                    planDurationInDays={calculateDays()}
                    numberOfSports={userData.selectedSports.length}
                    userEmail={userData.email}
                />
            )}
            {legalModalType && (
                 <LegalModal
                    title={legalModalType === 'terms' ? 'Términos de Servicio' : 'Política de Privacidad'}
                    content={legalModalType === 'terms' ? TERMS_OF_SERVICE : PRIVACY_POLICY}
                    onClose={() => setLegalModalType(null)}
                />
            )}
            {showPricingModal && <PricingModal onClose={() => setShowPricingModal(false)} />}
            {showCheckinModal && <DailyCheckinModal onSubmit={handleCheckinSubmit} onClose={() => setShowCheckinModal(false)} />}
            {showExperienceInfoModal && <ExperienceInfoModal onClose={() => setShowExperienceInfoModal(false)} />}
            {showFeedbackModal && <FeedbackModal onClose={() => setShowFeedbackModal(false)} />}
            {showReadjustModal && <ReadjustmentModal onClose={() => setShowReadjustModal(false)} onConfirm={handleConfirmReadjust} />}
            {showResetConfirm && (
                <ConfirmationModal
                    title="¿Empezar un Nuevo Plan?"
                    message="Esto archivará tu plan actual y te llevará a la pantalla de selección de deportes. ¿Estás seguro de que quieres continuar?"
                    confirmText="Sí, empezar nuevo plan"
                    cancelText="Cancelar"
                    onConfirm={() => handleReset(true)}
                    onClose={() => setShowResetConfirm(false)}
                />
            )}
            {showEndOfPlanModal && planAnalysis && (
                planAnalysis.qualifiesForCertificate ? (
                    <CertificateModal
                        isOpen={showEndOfPlanModal}
                        onClose={() => setShowEndOfPlanModal(false)}
                        userName={userData.name}
                        planAnalysis={planAnalysis}
                        planType={userData.planType || 'free'}
                        isSubscribed={isSubscribed}
                        certificatePaid={certificatePaid}
                        onInitiatePayment={handleInitiateCertificatePayment}
                    />
                ) : (
                    <ConfirmationModal
                        title="¡Plan Finalizado!"
                        message="¡Felicidades por tu esfuerzo! Aunque no se cumplieron todos los criterios para el certificado, has progresado enormemente. ¿Listo para tu próximo desafío?"
                        confirmText="Empezar Nuevo Plan"
                        cancelText="Cerrar"
                        onConfirm={() => { setShowEndOfPlanModal(false); handleReset(true); }}
                        onClose={() => setShowEndOfPlanModal(false)}
                    />
                )
            )}
            {showChangeSportsConfirm && (
                 <ConfirmationModal
                    title="¿Cambiar de Deportes?"
                    message="Tu progreso en el formulario actual se perderá y volverás a la pantalla de selección de deportes. ¿Estás seguro?"
                    confirmText="Sí, cambiar"
                    cancelText="Cancelar"
                    onConfirm={handleBackToSportSelection}
                    onClose={() => setShowChangeSportsConfirm(false)}
                />
            )}
            {showResumeConfirm && (
                 <ConfirmationModal
                    title="¿Continuar donde lo dejaste?"
                    message="Hemos encontrado un formulario sin terminar. ¿Quieres continuar rellenándolo?"
                    confirmText="Sí, continuar"
                    cancelText="No, empezar de nuevo"
                    onConfirm={handleResume}
                    onClose={handleDiscardResume}
                />
            )}
            {showFatigueWarning && (
                 <ConfirmationModal
                    title="¡Atención, Atleta!"
                    message="Hemos notado que tus últimos tres entrenamientos han sido 'difíciles'. Esto podría ser una señal de fatiga. ¿Te gustaría reajustar tu plan para enfocarte en la recuperación?"
                    confirmText="Sí, Reajustar"
                    cancelText="No, Seguir Así"
                    onConfirm={() => {
                        setShowFatigueWarning(false);
                        handleInitiateReadjust();
                    }}
                    onClose={() => setShowFatigueWarning(false)}
                />
            )}
            {workoutToLog && (
                <LogWorkoutModal
                    workout={workoutToLog}
                    onClose={() => setWorkoutToLog(null)}
                    onLog={handleLogWorkout}
                />
            )}
            <InteractiveTour 
                steps={tourSteps} 
                isOpen={isTourOpen} 
                onClose={() => {
                    setIsTourOpen(false);
                    localStorage.setItem('smaiflow-tour-seen', 'true');
                }}
            />

            <Footer 
                onShowFeedback={() => setShowFeedbackModal(true)} 
                onShowPricing={() => setShowPricingModal(true)}
                onShowLegal={setLegalModalType}
            />
        </div>
    );
};

export default App;