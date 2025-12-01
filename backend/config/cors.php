<?php

return [

    // Aplica CORS a estas rutas (API + sanctum si lo usas)
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // Métodos permitidos (puedes limitar a ['GET'] si quieres)
    'allowed_methods' => ['*'],

    // Orígenes del frontend (React Vite)
    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:8042',      // ← AGREGAR
        'http://127.0.0.1:8042',      // ← AGREGAR
        // Agrega aquí tu dominio en producción, p. ej.:
        // 'https://portal.gamc.gob.bo',
    ],

    // Si prefieres usar patrones regex, déjalo vacío si no lo necesitas
    'allowed_origins_patterns' => [],

    // Headers permitidos
    'allowed_headers' => ['*'],

    // Headers expuestos (normalmente vacío)
    'exposed_headers' => [],

    // Cache del preflight (segundos). 0 = desactivado.
    'max_age' => 0,

    // Solo true si vas a enviar cookies/credenciales cross-site
    'supports_credentials' => false,

];