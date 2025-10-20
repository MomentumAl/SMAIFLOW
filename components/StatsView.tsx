import React, { useEffect, useRef, useState } from 'react';
import { TrainingPlanData, PerceivedEffort, UserData, FlowScoreHistoryEntry, PlanAnalysis } from '../types';
import { BarChartIcon, CheckCircleIcon, StarIcon, MenuIcon, ClockIcon, RunIcon } from './IconComponents';
import LoadingSpinner from './LoadingSpinner';

interface Props {
  plan: TrainingPlanData;
  userData: UserData;
  planAnalysis: PlanAnalysis | null;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactElement }> = ({ title, value, icon }) => (
    <div className="bg-white/70 dark:bg-slate-700/60 p-4 rounded-xl border border-amber-200/80 dark:border-slate-600/60 flex items-center gap-4">
        <div className="text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-slate-600 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-amber-800 dark:text-slate-300">{title}</p>
            <p className="text-2xl font-bold text-amber-950 dark:text-slate-50">{value}</p>
        </div>
    </div>
);


const StatsView: React.FC<Props> = ({ plan, userData, planAnalysis }) => {
    const effortChartRef = useRef<HTMLCanvasElement>(null);
    const volumeChartRef = useRef<HTMLCanvasElement>(null);
    const flowScoreHistoryChartRef = useRef<HTMLCanvasElement>(null);
    const chartInstancesRef = useRef<any[]>([]);

    const [volumeMetric, setVolumeMetric] = useState<'duration' | 'distance' | 'count'>('duration');
    
    const allWorkouts = plan.plan.flatMap(week => week.workouts);
    const completedWorkouts = allWorkouts.filter(w => w.status === 'completed' && !w.type.toLowerCase().includes('descanso'));
    const flowScoreHistory: FlowScoreHistoryEntry[] = JSON.parse(localStorage.getItem('smaiflow-flow-score-history') || '[]');

    useEffect(() => {
        const createCharts = async () => {
            const { Chart, registerables } = await import('chart.js/auto');
            Chart.register(...registerables);
            
            chartInstancesRef.current.forEach(chart => chart.destroy());
            chartInstancesRef.current = [];

            const isDarkMode = document.documentElement.classList.contains('dark');
            const textColor = isDarkMode ? '#cbd5e1' : '#475569';
            const gridColor = isDarkMode ? 'rgba(71, 85, 105, 0.2)' : 'rgba(203, 213, 225, 0.5)';
            const doughnutBorderColor = isDarkMode ? '#1e293b' : '#ffffff';

            if (effortChartRef.current && completedWorkouts.length > 0) {
                const effortCounts: Record<PerceivedEffort, number> = {
                    facil: completedWorkouts.filter(w => w.perceivedEffort === 'facil').length,
                    perfecto: completedWorkouts.filter(w => w.perceivedEffort === 'perfecto').length,
                    dificil: completedWorkouts.filter(w => w.perceivedEffort === 'dificil').length,
                };

                const ctx = effortChartRef.current.getContext('2d');
                if (ctx) {
                    chartInstancesRef.current.push(new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            labels: ['Fácil', 'Perfecto', 'Difícil'],
                            datasets: [{
                                data: [effortCounts.facil, effortCounts.perfecto, effortCounts.dificil],
                                backgroundColor: ['#38bdf8', '#22c55e', '#ef4444'],
                                borderColor: doughnutBorderColor, borderWidth: 3,
                            }]
                        },
                        options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: textColor } } } }
                    }));
                }
            }
            
            if (volumeChartRef.current) {
                let chartData: number[] = [];
                let chartLabel = '';

                switch (volumeMetric) {
                    case 'duration':
                        chartLabel = 'Minutos Entrenados';
                        chartData = plan.plan.map(week => week.workouts.reduce((acc, w) => acc + (w.status === 'completed' ? w.duration || 0 : 0), 0));
                        break;
                    case 'distance':
                        chartLabel = 'Kilómetros Recorridos';
                        chartData = plan.plan.map(week => week.workouts.reduce((acc, w) => acc + (w.status === 'completed' ? w.distance || 0 : 0), 0));
                        break;
                    default:
                        chartLabel = 'Entrenamientos Completados';
                        chartData = plan.plan.map(week => week.workouts.filter(w => w.status === 'completed' && !w.type.toLowerCase().includes('descanso')).length);
                        break;
                }
                const weeklyLabels = plan.plan.map(week => `S${week.week}`);

                const ctx = volumeChartRef.current.getContext('2d');
                if (ctx) {
                    chartInstancesRef.current.push(new Chart(ctx, {
                        type: 'bar',
                        data: { labels: weeklyLabels, datasets: [{ label: chartLabel, data: chartData, backgroundColor: '#16a34a', borderRadius: 4 }] },
                        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: textColor }, grid: { color: gridColor } }, x: { ticks: { color: textColor }, grid: { display: false } } } }
                    }));
                }
            }

            if (flowScoreHistoryChartRef.current && flowScoreHistory.length > 0) {
                 const ctx = flowScoreHistoryChartRef.current.getContext('2d');
                 if(ctx) {
                    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                    gradient.addColorStop(0, 'rgba(245, 158, 11, 0.5)');
                    gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
                     chartInstancesRef.current.push(new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: flowScoreHistory.map(entry => new Date(entry.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short'})),
                            datasets: [{
                                label: 'Flow Score',
                                data: flowScoreHistory.map(entry => entry.score),
                                borderColor: '#f59e0b',
                                backgroundColor: gradient,
                                fill: true,
                                tension: 0.3,
                                pointBackgroundColor: '#f59e0b',
                                pointBorderColor: '#fff',
                            }]
                        },
                        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false, min: Math.min(...flowScoreHistory.map(e => e.score)) - 10, max: 100, ticks: { color: textColor }, grid: { color: gridColor } }, x: { ticks: { color: textColor }, grid: { display: false } } } }
                     }))
                 }
            }
        }
        
        createCharts();
        const observer = new MutationObserver((mutations) => { if (mutations.some(m => m.attributeName === 'class')) createCharts(); });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => {
            observer.disconnect();
            chartInstancesRef.current.forEach(chart => chart.destroy());
        };
    }, [plan, completedWorkouts, volumeMetric, flowScoreHistory]);


    if (completedWorkouts.length === 0) {
      return (
        <div className="bg-amber-100/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-amber-300/40 text-center animate-fade-in-up flex flex-col items-center justify-center h-full dark:bg-slate-800/80 dark:border-slate-700/60">
            <div className="mx-auto w-16 h-16 flex items-center justify-center bg-amber-200/70 dark:bg-slate-700 rounded-full">
                <BarChartIcon className="h-8 w-8 text-amber-700 dark:text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-amber-950 dark:text-slate-100 mt-6">Tu Panel de Control</h2>
            <p className="text-amber-800 mt-2 max-w-md mx-auto dark:text-slate-400">
                ¡Tu viaje está por comenzar! Completa tu primer entrenamiento y regístralo para desbloquear tus estadísticas de rendimiento y ver tu progreso en tiempo real.
            </p>
        </div>
      );
    }

    return (
        <div className="bg-amber-100/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-lg border border-amber-300/40 animate-fade-in-up space-y-8 dark:bg-slate-800/80 dark:border-slate-700/60">
            <div>
                <h2 className="text-2xl font-bold text-amber-950 dark:text-slate-100">Panel de Rendimiento</h2>
                <p className="mt-1 text-sm text-amber-800 dark:text-slate-400">Tu progreso, visualizado.</p>
            </div>
            
            {planAnalysis?.isFinished && (
                <div className="bg-blue-100/80 dark:bg-blue-900/40 p-5 rounded-2xl border border-blue-300/40 text-center">
                    <h3 className="text-xl font-bold text-blue-900 dark:text-blue-200">¡Plan Finalizado!</h3>
                    <p className="mt-2 text-blue-800 dark:text-blue-300">Has llegado al final de tu plan. ¡Felicidades por el esfuerzo! Revisa tus estadísticas y prepárate para tu próximo desafío.</p>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard title="Completados" value={planAnalysis?.completedCount ?? 0} icon={<CheckCircleIcon />} />
                <StatCard title="Adherencia" value={`${(planAnalysis?.completionRate ?? 0).toFixed(0)}%`} icon={<StarIcon />} />
                <StatCard title="Flow Score Prom." value={(planAnalysis?.averageFlowScore ?? 0).toFixed(1)} icon={<BarChartIcon className="h-5 w-5"/>} />
                <StatCard title="Tiempo Total" value={`${planAnalysis?.totalHours ?? 0} hrs`} icon={<ClockIcon className="h-5 w-5"/>} />
                <StatCard title="Distancia Total" value={`${(planAnalysis?.totalDistanceKm ?? 0).toFixed(1)} km`} icon={<RunIcon />} />
                <StatCard title="Elevación Total" value={`${planAnalysis?.totalElevationMeters ?? 0} m`} icon={<BarChartIcon className="h-5 w-5 rotate-90"/>} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                     <h3 className="text-lg font-bold text-amber-950 dark:text-slate-100 mb-4">Historial de Flow Score</h3>
                     <div className="bg-white/70 dark:bg-slate-700/60 p-4 rounded-xl border border-amber-200/80 dark:border-slate-600/60 flex items-center justify-center min-h-[250px]">
                        {flowScoreHistory.length > 1 ? (
                            <canvas ref={flowScoreHistoryChartRef}></canvas>
                        ) : (
                            <p className="text-sm text-center text-amber-700 dark:text-slate-300 p-4">Realiza tu check-in diario para empezar a ver tu historial de Flow Score aquí.</p>
                        )}
                     </div>
                </div>
                <div className="lg:col-span-2">
                     <h3 className="text-lg font-bold text-amber-950 dark:text-slate-100 mb-4">Distribución de Esfuerzo</h3>
                     <div className="bg-white/70 dark:bg-slate-700/60 p-4 rounded-xl border border-amber-200/80 dark:border-slate-600/60 flex items-center justify-center min-h-[250px]">
                        {completedWorkouts.some(w => w.perceivedEffort) ? (
                            <canvas ref={effortChartRef}></canvas>
                        ) : (
                            <p className="text-sm text-center text-amber-700 dark:text-slate-300 p-4">Registra la sensación de tus entrenamientos para ver este gráfico.</p>
                        )}
                     </div>
                </div>
                <div className="lg:col-span-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                        <h3 className="text-lg font-bold text-amber-950 dark:text-slate-100">Volumen Semanal</h3>
                        <div className="flex items-center gap-1 bg-amber-200/50 dark:bg-slate-700 p-1 rounded-lg self-start sm:self-center">
                            <button onClick={() => setVolumeMetric('duration')} className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${volumeMetric === 'duration' ? 'bg-white shadow dark:bg-slate-600 text-amber-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>Tiempo</button>
                            <button onClick={() => setVolumeMetric('distance')} className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${volumeMetric === 'distance' ? 'bg-white shadow dark:bg-slate-600 text-amber-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>Distancia</button>
                            <button onClick={() => setVolumeMetric('count')} className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${volumeMetric === 'count' ? 'bg-white shadow dark:bg-slate-600 text-amber-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>Sesiones</button>
                        </div>
                    </div>
                    <div className="bg-white/70 dark:bg-slate-700/60 p-4 rounded-xl border border-amber-200/80 dark:border-slate-600/60 min-h-[250px]">
                        <canvas ref={volumeChartRef}></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(StatsView);