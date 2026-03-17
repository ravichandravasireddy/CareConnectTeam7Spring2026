import PageMeta from '../components/PageMeta'
import '../components/Button.css'
import './Login.css'

export default function Login() {
  return (
    <>
      <PageMeta
        title="Sign In – CareConnect"
        description="Sign in to CareConnect, an accessible remote healthcare platform."
        path="/login"
      />
      <main role="main" className="login-page">
        <div className="login-card">
          <h1 className="login-title">Sign In</h1>
          <p className="login-subtitle">Sign in to CareConnect, an accessible remote healthcare platform.</p>
          <form className="login-form" aria-label="Sign in form" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="email" className="login-label">Email</label>
            <input id="email" type="email" className="login-input" placeholder="you@example.com" autoComplete="email" />
            <label htmlFor="password" className="login-label">Password</label>
            <input id="password" type="password" className="login-input" placeholder="••••••••" autoComplete="current-password" />
            <button type="submit" className="btn btn--primary login-submit">
              Sign In
            </button>
          </form>
        </div>
      </main>
    </>
  )
}
