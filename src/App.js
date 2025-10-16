// /src/App.js
import React from 'react';
import './App.css';
import Dashboard from './views/Dashboard'; // Importamos nuestra nueva vista

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <h1>Dashboard de Salud Mental</h1>
          <p>Análisis de Ingresos Hospitalarios</p>
        </header>
        <Dashboard /> {/* Renderizamos el dashboard */}
      </div>
  );
}

export default App;