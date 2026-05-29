const App = () => {
  // ✅ TEMPORAL - Para diagnosticar
  console.log('🔥 Firebase Config:', {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '✅ OK' : '❌ FALTA',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ OK' : '❌ FALTA',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ OK' : '❌ FALTA',
    appId: import.meta.env.VITE_FIREBASE_APP_ID ? '✅ OK' : '❌ FALTA',
  });

  return (
    <AuthProvider>
      <Web3Provider>
        <NavigationProvider>
          <AppShell />
        </NavigationProvider>
      </Web3Provider>
    </AuthProvider>
  );
};
export default App; // ← ¿Está esto?
