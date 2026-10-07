# Roadmap

- [ ] Dominios: vista /domains y modal de creación con identidad Compacto, búsqueda, filtros y validación visual; sin conexión DNS real.

- [x] Modal QR (Compacto): tamaño corregido (la librería pisaba el diseño con estilos inline) y verificado.
- [x] Modal de eliminación (Compacto): creado según captura de referencia (Cancelar + Eliminar rojo), verificado en escritorio y móvil.
- [x] Modal unificado de edición: variante 3 (asistente por pasos) APROBADA por el usuario; General y Destinos dinámicos funcionales.
- [x] Canales: iconos por canal, creación/eliminación de rutas y estado vacío aprobado.
- [x] A/B: variante “Laboratorio moderno” con configuración intuitiva, IDs y embudos de conversión.
- [x] Dispositivo/Ubicación: lista estructurada con reglas, prioridad, reordenación y estado vacío.
- [x] Agenda: tarjetas por ventana con zona horaria, repetición única/semanal, prioridad, métricas e IDs.
- [x] Dashboard general (/): rediseño "Pulso de enlaces" en la familia de /otp-dashboard, con estados de carga, vacío, error y plan Free.
- [x] Vista de planes (/pricing): diseño "Editorial claro" (fondo claro con puntos técnicos, tarjetas equivalentes, Prime destacado con borde verde), selector mensual/anual y USD; botones "Mejorar/Gestionar plan" del dashboard enlazados.
- [ ] Acceso inicial: comparar tres alternativas nuevas con distribuciones distintas, conservando la identidad Compacto.
- [x] Auth: vista de bienvenida /auth con concepto módulos conectados (Crear → Distribuir → Medir), split 55/45, modo oscuro y selector de idioma.
- [x] Login: vista /login con anillo orbital giratorio (diseño v4-anillo), formulario completo (correo, contraseña con mostrar/ocultar, mantener sesión, GitHub/Google) y flujo /auth → /login → dashboard.
- [x] Recuperar contraseña: /forgot-password con anillo orbital y cuadrícula del login, captcha de prueba, estado "Revisa tu correo" y enlace desde /login.
- [x] Bienvenida primer ingreso: modal esmeralda con ruta de señal animada, pasos Crear → Distribuir → Medir y botón "¡Listo, empecemos!"; se muestra solo la primera vez (localStorage) y se cierra con botón o Escape.
- [x] Dashboard OTP: /otp-dashboard con héroe Pulso OTP, filtros pegajosos, KPI, tendencia, embudo, plan, SLA, canal, proveedores, mapa de calor, plantillas, actividad y estados (carga/vacío/error/sin plan).
