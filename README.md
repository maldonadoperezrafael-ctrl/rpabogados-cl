# RP Abogados · rpabogados.cl

Sitio de RP Abogados para la Región Metropolitana y la Región de O’Higgins, publicado con React, TypeScript, Vite y Cloudflare Pages.

## Desarrollo y compilación

```bash
npm install
npm run check
npm run build
```

La compilación se genera en `dist/`. Las rutas de React se sirven mediante `public/_redirects` y las cabeceras de seguridad están en `public/_headers`.

## Contacto

El alojamiento público es estático. El formulario valida los campos y prepara un mensaje dirigido a `contacto@rpabogados.cl`; el visitante debe abrirlo en su correo, revisarlo y enviarlo. La interfaz no afirma que la solicitud se haya enviado o registrado antes de ese paso. No se utiliza almacenamiento del navegador como sustituto de una base de datos.

## Editorial

`npm run update:insights` actualiza `src/data/actualidad.json` con Fallos del Poder Judicial y Prensa de El Mostrador. El proceso valida URLs, descarta contenido irrelevante, deduplica y conserva el último contenido válido como respaldo. Los artículos de Análisis RP sólo se agregan con autoría, revisión profesional y fuentes verificables.

## Recuperación

La rama `respaldo-pre-terracota-20261030` conserva el estado de producción anterior a esta publicación.
