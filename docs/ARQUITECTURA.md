# Arquitectura — Democracia Directa

## Stack tecnológico

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Base de datos**: PostgreSQL (via Prisma ORM)
- **Caché/Sesiones**: Redis
- **Autenticación**: JWT (access 15min + refresh 7 días en cookie httpOnly)
- **2FA**: TOTP (Google Authenticator compatible) via speakeasy

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Estilos**: Tailwind CSS
- **Estado global**: Zustand (persistido en localStorage solo el token)
- **Peticiones**: Axios + TanStack Query
- **Formularios**: React Hook Form + Zod

---

## Simulación de Blockchain

### Cómo funciona

Cada vez que ocurre una acción importante (propuesta creada, voto emitido), se añade un bloque a la cadena:

1. Se toman los datos del bloque + hash del bloque anterior
2. Se calcula SHA-256 iterando nonces hasta encontrar un hash con 3 ceros al inicio (Proof of Work ligero)
3. El bloque queda guardado en PostgreSQL con su hash, previousHash, y Merkle Root
4. Se devuelve el hash al usuario como "recibo de voto"

### Verificación

Cualquier visitante puede:
- Ver todos los bloques en `/explorador`
- Verificar la integridad de la cadena en `/api/v1/blockchain/verify`
- Comprobar un recibo de voto específico en `/api/v1/blockchain/verify-vote/:hash`

Si alguien manipula un bloque en la base de datos, el `previousHash` del siguiente bloque no coincidirá → cadena rota → detectable públicamente.

---

## Seguridad implementada

### Autenticación
- Bcrypt con 12 rondas para contraseñas
- Tokens JWT de corta vida (15 min) + refresh en cookie httpOnly
- 2FA con TOTP (código de 6 dígitos cada 30s)
- Bloqueo de cuenta tras 5 intentos fallidos (15 min)
- Verificación de email obligatoria

### API
- Rate limiting global: 200 req/15min por IP
- Rate limit de login: 5 intentos/15min por IP
- Rate limit de registro: 3 cuentas/hora por IP
- Rate limit de propuestas: 5 propuestas/hora por usuario
- Validación de inputs con express-validator + Zod
- Sanitización de todos los campos de texto

### Headers HTTP (Helmet)
- Content-Security-Policy
- HSTS (1 año, incluye subdominios, preload)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### CORS
- Solo permite peticiones del dominio frontend configurado
- Cookies con SameSite: Strict en producción

---

## Modelo de datos

```
User → Proposals → Votes → Blocks
User → Sessions
User → Notifications
Block (cadena encadenada por previousHash)
```

---

## Roadmap

### Fase 1 (actual) — Base funcional
- [x] Arquitectura backend + frontend
- [x] Blockchain simulada con SHA-256
- [x] Autenticación segura con 2FA
- [x] Registro con identidad hash tipo Web3
- [x] Perfil público/privado
- [ ] Instalar dependencias y levantar BD

### Fase 2 — Contenido y UX
- [ ] Manifiesto ciudadano (texto colaborativo)
- [ ] Dashboard con propuestas activas
- [ ] Explorador de bloques interactivo
- [ ] Sistema de comentarios en propuestas

### Fase 3 — Viral
- [ ] Compartir recibo de voto en redes
- [ ] Comparativas territoriales
- [ ] App móvil
- [ ] Deploy en servidor público
