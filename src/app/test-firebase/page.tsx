import { FirebaseTest } from "@/components/firebase-test";

export default function TestFirebasePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Firebase Connection Diagnostic
          </h1>
          <p className="text-gray-600">
            Use this tool to diagnose Firebase connection issues with your custom domain
          </p>
        </div>

        <FirebaseTest />

        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            🔧 Common Solutions:
          </h2>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>
              <strong>1. Domain Authorization:</strong> Add your custom domain to Firebase Auth authorized domains
            </li>
            <li>
              <strong>2. Environment Variables:</strong> Ensure Firebase config is set in Vercel production environment
            </li>
            <li>
              <strong>3. Firebase Rules:</strong> Deploy updated Firestore and Storage rules
            </li>
            <li>
              <strong>4. Cache Clear:</strong> Try hard refresh (Ctrl+F5) after making changes
            </li>
          </ul>
        </div>

        <div className="mt-6 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
          <h2 className="text-lg font-semibold text-yellow-900 mb-3">
            📋 Manual Steps:
          </h2>
          <ol className="text-yellow-800 space-y-2 text-sm">
            <li>
              <strong>1.</strong> Go to <a href="https://console.firebase.google.com/" className="underline" target="_blank">Firebase Console</a>
            </li>
            <li>
              <strong>2.</strong> Select your project: <code>ig-thar-village</code>
            </li>
            <li>
              <strong>3.</strong> Navigate to: Authentication → Settings → Authorized domains
            </li>
            <li>
              <strong>4.</strong> Add your custom domain(s)
            </li>
            <li>
              <strong>5.</strong> Test again using the button above
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
