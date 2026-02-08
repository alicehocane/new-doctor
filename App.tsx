import React, { useState, useEffect } from 'react';
import { Route, Switch, Router } from 'wouter';
import RootLayout from './app/layout';
import HomePage from './app/page';
import AdminUploadPage from './app/admin/upload/page';
import SearchPage from './app/buscar/page';
import DoctorProfile from './app/medico/[slug]/page';
import CityPage from './app/doctores/[city]/page';
import CitySpecialtyPage from './app/doctores/[city]/[specialty]/page';
import SpecialtyPage from './app/especialidad/[specialty]/page';
import SpecialtiesIndexPage from './app/especialidades/page';
import DiseasesIndexPage from './app/enfermedades/page';
import DiseasePage from './app/enfermedad/[disease]/page';
import DiseaseCityPage from './app/enfermedad/[disease]/[city]/page';
import PrivacyPage from './app/privacidad/page';
import TermsPage from './app/terminos/page';
import AboutPage from './app/nosotros/page';
import ContactPage from './app/contacto/page';
import EncyclopediaIndexPage from './app/enciclopedia/page';
import ArticlePage from './app/enciclopedia/[slug]/page';

// Hook for hash-based routing (e.g., /#/buscar)
// This avoids "SecurityError: Failed to execute 'pushState'" in sandboxed environments
const useHashLocation = () => {
  const [loc, setLoc] = useState(() => {
    // Return path only (strip query string for wouter matching)
    const hash = window.location.hash.replace(/^#/, "") || "/";
    return hash.split('?')[0]; 
  });

  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash.replace(/^#/, "") || "/";
      setLoc(hash.split('?')[0]);
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = (to: string) => {
    window.location.hash = to;
  };

  return [loc, navigate] as [string, (to: string) => void];
};

const App = () => {
  return (
    <Router hook={useHashLocation}>
      <RootLayout>
        <Switch>
          {/* Static Routes */}
          <Route path="/">
            <HomePage />
          </Route>
          
          <Route path="/admin/upload">
            <AdminUploadPage />
          </Route>
          
          <Route path="/buscar">
            <SearchPage />
          </Route>

          <Route path="/especialidades">
            <SpecialtiesIndexPage />
          </Route>

          <Route path="/enfermedades">
            <DiseasesIndexPage />
          </Route>

          {/* Encyclopedia Routes */}
          <Route path="/enciclopedia">
            <EncyclopediaIndexPage />
          </Route>

          <Route path="/enciclopedia/:slug">
            {(params) => <ArticlePage params={params} />}
          </Route>

          {/* Footer Pages */}
          <Route path="/nosotros">
            <AboutPage />
          </Route>

          <Route path="/contacto">
            <ContactPage />
          </Route>

          <Route path="/privacidad">
            <PrivacyPage />
          </Route>

          <Route path="/terminos">
            <TermsPage />
          </Route>
          
          {/* Dynamic Routes */}
          
          <Route path="/medico/:slug">
            {(params) => <DoctorProfile params={params} />}
          </Route>
          
          <Route path="/doctores/:city/:specialty">
            {(params) => <CitySpecialtyPage params={params} />}
          </Route>

          <Route path="/doctores/:city">
            {(params) => <CityPage params={params} />}
          </Route>

          <Route path="/especialidad/:specialty">
            {(params) => <SpecialtyPage params={params} />}
          </Route>

          {/* New Disease+City Route must come before generic Disease Route to ensure correct matching precedence if needed */}
          <Route path="/enfermedad/:disease/:city">
            {(params) => <DiseaseCityPage params={params} />}
          </Route>

          <Route path="/enfermedad/:disease">
            {(params) => <DiseasePage params={params} />}
          </Route>

          {/* 404 Fallback */}
          <Route>
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
              <h1 className="text-4xl font-bold text-slate-300">404</h1>
              <p className="text-slate-500 mt-2">Página no encontrada</p>
              <p className="text-xs text-slate-400 mt-4">Ruta actual no coincide con ninguna página.</p>
              <a href="#/" className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-sky-600 transition-colors">
                Volver al inicio
              </a>
            </div>
          </Route>
        </Switch>
      </RootLayout>
    </Router>
  );
};

export default App;