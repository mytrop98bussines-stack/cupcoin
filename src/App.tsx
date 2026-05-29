const App = () => {
  // ✅ TEMPORAL - Muestra errores en pantalla
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  return (
    <>
      {/* TEMPORAL - Borrar después */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0,
        background: 'black', 
        color: 'white',
        padding: '10px',
        fontSize: '12px',
        zIndex: 9999 
      }}>
        <p>API Key: {config.apiKey ? '✅' : '❌ FALTA'}</p>
        <p>Project: {config.projectId ? '✅' : '❌ FALTA'}</p>
        <p>App ID: {config.appId ? '✅' : '❌ FALTA'}</p>
      </div>

      <AuthProvider>
        <Web3Provider>
          <NavigationProvider>
            <AppShell />
          </NavigationProvider>
        </Web3Provider>
      </AuthProvider>
    </>
  );
};

export default App;
