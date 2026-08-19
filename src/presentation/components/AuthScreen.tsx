import React, { useState } from 'react';
import { useAuth } from '../../infrastructure/AuthContext';
import { webStyles } from '../styles/webStyles';
import logoBundiKey from '../../assets/logo-bundikey.png';
import type { AuthMode } from '../../domain/types';

export const AuthScreen: React.FC = () => {
  const { login, register, recoverPassword } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('LOGIN');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (authMode === 'REGISTER' && password.length < 6) {
      return setAuthError('La contraseña debe tener al menos 6 caracteres.');
    }

    if (authMode === 'LOGIN') {
      const result = await login(correo, password);
      if (!result.success) setAuthError(result.message ?? 'Correo o contraseña incorrectos.');
    } else if (authMode === 'REGISTER') {
      const result = await register({ correo, password, nombre, telefono, direccion });
      if (result.success) {
        setAuthSuccess('¡Cuenta creada con éxito! Espera la aprobación del Administrador.');
        setCorreo(''); setPassword(''); setNombre('');
      } else {
        setAuthError(result.message ?? 'No se pudo crear la cuenta.');
      }
    } else if (authMode === 'RECOVER') {
      const result = await recoverPassword(correo);
      if (result.success) setAuthSuccess(`Se envió un correo de recuperación a ${correo}.`);
      else setAuthError(result.message ?? 'No se pudo enviar el correo de recuperación.');
    }
  };

  const subtitle = authMode === 'LOGIN' ? 'Inicia sesión para gestionar pedidos.' : authMode === 'REGISTER' ? 'Crea tu cuenta para acceder al sistema.' : 'Te enviaremos las instrucciones a tu correo.';

  return (
    <div style={webStyles.authBackground}>
      <div style={webStyles.authCard} className="bk-modal-enter">
        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <img src={logoBundiKey} alt="BundiKey" style={{ width: '100%', maxWidth: '250px', marginBottom: '14px' }} />
          <span style={webStyles.authEyebrow}>Pastelería · Cafetería</span>
          <p style={webStyles.authSubtitle}>{subtitle}</p>
        </div>

        <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {authError && <div style={webStyles.errorBox}>{authError}</div>}
          {!authError && authSuccess && <div style={webStyles.successBox}>{authSuccess}</div>}

          {authMode === 'REGISTER' && (
            <>
              <div style={webStyles.inputGroup}>
                <label style={webStyles.label}>Nombres y Apellidos</label>
                <input className="bk-input" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={webStyles.input} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={webStyles.inputGroup}>
                  <label style={webStyles.label}>Celular</label>
                  <input className="bk-input" type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={webStyles.input} />
                </div>
                <div style={webStyles.inputGroup}>
                  <label style={webStyles.label}>Dirección</label>
                  <input className="bk-input" type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} style={webStyles.input} />
                </div>
              </div>
            </>
          )}

          <div style={webStyles.inputGroup}>
            <label style={webStyles.label}>Correo Electrónico</label>
            <input className="bk-input" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required style={webStyles.input} />
          </div>

          {authMode !== 'RECOVER' && (
            <div style={webStyles.inputGroup}>
              <label style={webStyles.label}>Contraseña</label>
              <input className="bk-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={webStyles.input} />
            </div>
          )}

          <button type="submit" className="bk-btn" style={webStyles.primaryBtn}>
            {authMode === 'LOGIN' ? 'Iniciar Sesión' : authMode === 'REGISTER' ? 'Crear Cuenta' : 'Enviar Enlace'}
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '13px' }}>
          {authMode !== 'LOGIN' && <button onClick={() => {setAuthMode('LOGIN'); setAuthError(''); setAuthSuccess('');}} style={webStyles.linkBtn}>← Volver al Login</button>}
          {authMode === 'LOGIN' && (
            <>
              <button onClick={() => {setAuthMode('REGISTER'); setAuthError(''); setAuthSuccess('');}} style={webStyles.linkBtn}>Registrarse</button>
              <button onClick={() => {setAuthMode('RECOVER'); setAuthError(''); setAuthSuccess('');}} style={webStyles.linkBtn}>Olvidé mi contraseña</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};