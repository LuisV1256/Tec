# Decisiones de arquitectura

**01 — ¿Dónde vive la validación de las reglas de estado y por qué ahí?**
En `InmueblesService` ([backend/src/inmuebles/inmuebles.service.ts](backend/src/inmuebles/inmuebles.service.ts)), usando el mapa `TRANSICIONES_VALIDAS` de [estados-inmueble.constants.ts](backend/src/inmuebles/estados-inmueble.constants.ts). Va en el servicio, no en el controller ni en la base de datos: el controller es una capa delgada (solo enruta), y una regla de negocio como "VENDIDO es terminal" no se puede expresar con claridad ni testear ni devolver un código de error específico (409 + `code`) si viviera en un CHECK de Postgres.

**02 — ¿Cómo garantizas que un usuario no pueda modificar recursos ajenos?**
`vendedorId`/el `id` del usuario nunca se acepta del body (el `ValidationPipe` en modo whitelist lo descarta si alguien lo manda) — siempre sale del JWT verificado por `JwtAuthGuard`. Antes de cualquier `update`/`estado`/`delete`, el servicio compara ese id contra el dueño real del recurso. Si no coincide, o si el recurso no existe, la respuesta es **404** en ambos casos (no 403): así no se confirma que un inmueble o cuenta ajena existe (mitigación IDOR).

**03 — ¿Dónde guardas el token en el cliente y qué riesgo asumes?**
`localStorage` (ver [frontend/src/services/api.ts](frontend/src/services/api.ts)). Riesgo: si hubiera una vulnerabilidad XSS, un script podría leer el token y suplantar al usuario. Lo asumo porque el frontend no usa `dangerouslySetInnerHTML` ni libraries de terceros que inyecten HTML sin sanitizar, y porque el JWT expira en 24h — no es una llave permanente. La alternativa más segura (cookie `httpOnly`) hubiera requerido rearmar CORS/credentials en el backend, que no era parte del alcance.

**04 — ¿Qué deuda técnica asumiste conscientemente por el límite de tiempo?**
Sin tests automatizados (Jest) en backend ni frontend — todo se verificó manualmente con peticiones reales y en el navegador. Sin refresh token: al expirar el JWT, el usuario simplemente vuelve a loguearse. Sin índices explícitos adicionales en `inmuebles` para las columnas que más se filtran (`vendedorId`, `estadoId`, `tipoInmuebleId`) más allá de los que Postgres crea automáticamente para las FK. Sin Docker Compose (el opcional): la base de datos se levanta con un `docker run` manual documentado en el README.
