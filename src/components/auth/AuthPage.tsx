import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const { signup, login, error, isLoading } = useAuthStore();

  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleMethodChange = () => {
    setIsSignUpActive(!isSignUpActive);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSignUpActive) {
      await signup(username, email, password);
      navigate('/dashboard');
    } else if (!isSignUpActive) {
      const response = await login(email, password);

      if (response) {
        const { user, message } = response;
        console.log('user is:', user, 'message ', message);
        navigate('/dashboard');
      } else {
        console.log(error, 'Login failed');
      }
    }
  };
  return (
    <div className="container">
      <div className="row align-items-center min-vh-100">
        <div className="col-md-12">
          <h1 className="mb-5 text-center">
            <span className="text-info fw-bolder">DP</span>{' '}
            {isSignUpActive ? 'Registration' : 'App Login'}
          </h1>

          <form
            onSubmit={handleSignUp}
            className="border border-info rounded-3 px-3 pt-5 bg-light m-auto loginForm mb-5"
          >
            {error && (
              <div className="alert alert-danger text-center">{error}</div>
            )}
            {isSignUpActive && (
              <div className="row mb-3">
                <label htmlFor="inputName" className="col-sm-2 col-form-label">
                  Name
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="inputName"
                    name="name"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="row mb-3">
              <label htmlFor="inputEmail" className="col-sm-2 col-form-label">
                Email
              </label>
              <div className="col-sm-10">
                <input
                  type="email"
                  className="form-control"
                  id="inputEmail"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label
                htmlFor="inputPassword"
                className="col-sm-2 col-form-label"
              >
                Password
              </label>
              <div className="col-sm-10">
                <input
                  type="password"
                  className="form-control"
                  id="inputPassword"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="d-grid gap-2 mb-4 mt-5">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? 'Processing...'
                  : isSignUpActive
                  ? 'Register'
                  : 'Login'}
              </button>
            </div>
          </form>
          <div className="fw-bold text-end px-2 loginForm m-auto">
            <a
              className="link-primary text-decoration-none"
              role="button"
              onClick={handleMethodChange}
            >
              {isSignUpActive ? 'Login' : 'Create an account'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
