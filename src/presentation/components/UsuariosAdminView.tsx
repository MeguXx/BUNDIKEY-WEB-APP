import React, { useEffect, useState } from 'react';
import { suscribirUsuarios, actualizarAccesoUsuario } from '../../infrastructure/usuariosRepository';
import type { UsuarioDB, RolUsuario } from '../../domain/types';
import { COLORS } from '../../constants/theme';
import { webStyles } from '../styles/webStyles';

export const UsuariosAdminView: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UsuarioDB[]>([]);

  useEffect(() => {
    const unsub = suscribirUsuarios(setUsuarios);
    return () => unsub();
  }, []);

  const handleToggleActivo = async (u: UsuarioDB) => {
    const accion = u.activo ? 'DESACTIVAR' : 'APROBAR';
    if (!window.confirm(`¿Confirmas ${accion} el acceso de "${u.nombre}" (${u.correo})?`)) return;
    await actualizarAccesoUsuario(u.uid, u.rol, !u.activo);
  };

  const handleChangeRol = async (u: UsuarioDB, nuevoRol: RolUsuario) => {
    if (nuevoRol === u.rol) return;
    if (!window.confirm(`¿Confirmas cambiar el rol de "${u.nombre}" de ${u.rol} a ${nuevoRol}? Esto cambia lo que puede ver y hacer en el sistema.`)) return;
    await actualizarAccesoUsuario(u.uid, nuevoRol, u.activo);
  };

  return (
    <div style={webStyles.catalogoContainer}>
      <h2 style={webStyles.sectionTitle}>Gestión de Accesos y Roles</h2>
      <p style={{ color: COLORS.moca, fontSize: '14px', marginBottom: '22px' }}>
        Aprueba usuarios pendientes y asigna sus roles operativos.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {usuarios.map(u => (
          <div key={u.uid} style={{ ...webStyles.catalogCard, flexDirection: 'row', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 4px', color: COLORS.chocolate, fontSize: '16px' }}>{u.nombre}</h3>
              <p style={{ margin: 0, color: COLORS.moca, fontSize: '13px' }}>{u.correo}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select
                value={u.rol}
                onChange={(e) => handleChangeRol(u, e.target.value as RolUsuario)}
                style={{ ...webStyles.input, width: 'auto', padding: '8px' }}
              >
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="ADMIN">ADMIN</option>
                <option value="CAJA">CAJA</option>
                <option value="SALA">SALA</option>
                <option value="COCINA">COCINA</option>
              </select>
              <button
                className="bk-btn"
                onClick={() => handleToggleActivo(u)}
                style={{
                  ...webStyles.primaryBtn,
                  padding: '8px 16px',
                  backgroundColor: u.activo ? COLORS.rojo : COLORS.verde,
                }}
              >
                {u.activo ? 'Desactivar' : 'Aprobar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};