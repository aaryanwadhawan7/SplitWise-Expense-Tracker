import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';

export default function Login() {
  // Email and password form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Whether form is signup (true) or login (false)
  const [isSignUp, setIsSignUp] = useState(false);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Create Firebase user with email/pwd
        const userCred = await createUserWithEmailAndPassword(auth, email, password);

        // Create Firestore user document with role = "user"
        await setDoc(doc(db, "users", userCred.user.uid), {
          email,
          role: "user",           // Default role assigned on signup
          createdAt: new Date()
        });
      } else {
        // Sign in existing user
        await signInWithEmailAndPassword(auth, email, password);
      }

      // Redirect to dashboard after success
      navigate('/dashboard');

    } catch (err) {
      setError(err.message);  // Show error messages
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f3f4f6" }}>
      <div style={{ background:"white", padding:32, width:320, borderRadius:8, boxShadow:"0 2px 8px #ccc" }}>
        <h2 style={{textAlign:"center", marginBottom:24}}>
          {isSignUp ? 'Create account' : 'Sign in'}
        </h2>

        {error && <div style={{color:"red", marginBottom:16}}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            disabled={loading}
            value={email}
            onChange={e=>setEmail(e.target.value)}
            style={{ width:"100%", marginBottom:12, padding:8, borderRadius:4, border:"1px solid #ccc" }}
          />
          <input
            type="password"
            placeholder="Password"
            required
            disabled={loading}
            value={password}
            onChange={e=>setPassword(e.target.value)}
            style={{ width:"100%", marginBottom:12, padding:8, borderRadius:4, border:"1px solid #ccc" }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{ width:"100%", padding:10, background:"#4f46e5", color:"#fff", borderRadius:4, border:"none", fontSize:16 }}
          >
            {loading ? (isSignUp ? "Creating Account..." : "Signing In...") : (isSignUp ? "Sign Up" : "Sign In")}
          </button>
        </form>

        <div style={{ marginTop:16, textAlign:"center" }}>
          <button type="button" onClick={() => {setIsSignUp(!isSignUp); setError('')}} style={{ background:"none", border:"none", color:"#4f46e5", cursor:"pointer", fontSize:14, textDecoration:"underline" }}>
            {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
