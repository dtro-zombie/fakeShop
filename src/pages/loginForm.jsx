import React, { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar la lógica de envío del formulario, por ejemplo, enviar a una API
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Remember Me:', rememberMe);
    // Agrega tu lógica de autenticación aquí
  };

  return (
    <form onSubmit={handleSubmit}>
      <div data-mdb-input-init className="form-outline mb-4">
        <input
          type="email"
          id="form2Example1"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="form-label" htmlFor="form2Example1">
          Email address
        </label>
      </div>

      <div data-mdb-input-init className="form-outline mb-4">
        <input
          type="password"
          id="form2Example2"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className="form-label" htmlFor="form2Example2">
          Password
        </label>
      </div>

      <div className="row mb-4">
        <div className="col d-flex justify-content-center">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="form2Example31"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="form2Example31">
              {' '}
              Remember me{' '}
            </label>
          </div>
        </div>

        <div className="col">
          <a href="#!">Forgot password?</a>
        </div>
      </div>

      <button type="submit" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-block mb-4">
        Sign in
      </button>

      <div className="text-center">
        <p>
          Not a member? <a href="#!">Register</a>
        </p>
        <p>or sign up with:</p>
        <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-floating mx-1">
          <i className="fab fa-facebook-f"></i>
        </button>

        <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-floating mx-1">
          <i className="fab fa-google"></i>
        </button>

        <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-floating mx-1">
          <i className="fab fa-twitter"></i>
        </button>

        <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-floating mx-1">
          <i className="fab fa-github"></i>
        </button>
      </div>
    </form>
  );
}

export default LoginForm;