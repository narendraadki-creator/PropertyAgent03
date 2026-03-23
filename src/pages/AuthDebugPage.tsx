import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthDebugPage() {
  const [authInfo, setAuthInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const info: any = {};

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      info.session = session ? {
        user_id: session.user?.id,
        email: session.user?.email,
        expires_at: new Date(session.expires_at! * 1000).toLocaleString(),
        has_access_token: !!session.access_token,
        has_refresh_token: !!session.refresh_token
      } : null;
      info.sessionError = sessionError?.message;

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      info.user = user ? {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      } : null;
      info.userError = userError?.message;

      const keys = Object.keys(localStorage).filter(k => k.includes('supabase') || k.includes('sb-'));
      info.localStorage = keys.length > 0 ? keys : 'No Supabase keys found';

    } catch (error: any) {
      info.error = error.message;
    }

    setAuthInfo(info);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Loading Auth Debug Info...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Authentication Debug</h1>

      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-400">Session Info</h2>
          {authInfo.session ? (
            <pre className="text-sm bg-gray-900 p-4 rounded overflow-auto">
              {JSON.stringify(authInfo.session, null, 2)}
            </pre>
          ) : (
            <p className="text-red-400">No session found {authInfo.sessionError && `(${authInfo.sessionError})`}</p>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">User Info</h2>
          {authInfo.user ? (
            <pre className="text-sm bg-gray-900 p-4 rounded overflow-auto">
              {JSON.stringify(authInfo.user, null, 2)}
            </pre>
          ) : (
            <p className="text-red-400">No user found {authInfo.userError && `(${authInfo.userError})`}</p>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-purple-400">LocalStorage</h2>
          {typeof authInfo.localStorage === 'string' ? (
            <p className="text-red-400">{authInfo.localStorage}</p>
          ) : (
            <ul className="list-disc list-inside text-sm">
              {authInfo.localStorage.map((key: string) => (
                <li key={key} className="mb-1">{key}</li>
              ))}
            </ul>
          )}
        </div>

        {authInfo.error && (
          <div className="bg-red-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Error</h2>
            <p>{authInfo.error}</p>
          </div>
        )}

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">Diagnosis</h2>
          {authInfo.session && authInfo.user ? (
            <p className="text-green-400 text-lg font-semibold">✅ Authentication is working correctly!</p>
          ) : (
            <div className="text-red-400 space-y-2">
              <p className="text-lg font-semibold">❌ Authentication problem detected:</p>
              <ul className="list-disc list-inside ml-4">
                {!authInfo.session && <li>No active session</li>}
                {!authInfo.user && <li>No user logged in</li>}
                {authInfo.localStorage === 'No Supabase keys found' && <li>No auth tokens in localStorage</li>}
              </ul>
              <p className="mt-4 font-semibold">Recommended actions:</p>
              <ol className="list-decimal list-inside ml-4">
                <li>Log out and log back in</li>
                <li>Clear browser cache and cookies</li>
                <li>Check that cookies are enabled</li>
                <li>Try in incognito mode</li>
              </ol>
            </div>
          )}
        </div>

        <button
          onClick={checkAuth}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700"
        >
          Refresh Auth Check
        </button>

        <button
          onClick={() => window.location.href = '/'}
          className="ml-4 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
