// /src/views/Dashboard.js
import React, { useState, useEffect } from 'react';
import ChartCard from '../components/ChartCard'; // Reutilizamos el que ya creamos

const Dashboard = () => {
    const [monthlyData, setMonthlyData] = useState(null);
    const [diagnosesData, setDiagnosesData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Función para cargar todos los datos de los gráficos
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Hacemos las dos peticiones a nuestra API dinámica
                const monthlyRes = await fetch('/api/charts?type=ingresosPorMes');
                const monthlyJson = await monthlyRes.json();
                // Añadimos configuración de estilo aquí
                monthlyJson.datasets[0].label = 'Nº de Ingresos';
                monthlyJson.datasets[0].backgroundColor = 'rgba(54, 162, 235, 0.6)';
                setMonthlyData(monthlyJson);

                const diagnosesRes = await fetch('/api/charts?type=diagnosticosComunes');
                const diagnosesJson = await diagnosesRes.json();
                diagnosesJson.datasets[0].label = 'Nº de Casos';
                diagnosesJson.datasets[0].backgroundColor = 'rgba(255, 99, 132, 0.6)';
                setDiagnosesData(diagnosesJson);

            } catch (error) {
                console.error("Error al cargar los datos del dashboard", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []); // El array vacío [] significa que se ejecuta solo una vez, al cargar la página

    if (isLoading) {
        return <div>Cargando datos del dashboard...</div>;
    }

    return (
        <main>
            {/* Aquí irían las tarjetas de KPIs que cargarían desde /api/kpis.js */}

            {monthlyData && (
                <ChartCard
                    chartData={monthlyData}
                    title="Evolución Mensual de Ingresos"
                />
            )}

            {diagnosesData && (
                <ChartCard
                    chartData={diagnosesData}
                    title="Top 5 Diagnósticos Más Comunes"
                />
            )}
        </main>
    );
};

export default Dashboard;