// wompiConfig.ts

// ❗️❗️❗️ NOTA IMPORTANTE SOBRE SEGURIDAD ❗️❗️❗️
//
// Esta configuración está preparada para el cambio a producción.
// El SECRETO DE INTEGRIDAD NUNCA debe estar en este archivo.
// Debe vivir de forma segura en las variables de entorno de tu backend.

// Cambia esto a `false` cuando estés listo para hacer pagos reales en producción.
export const IS_TEST_MODE = true;

// 1. Llaves públicas de Wompi
// Recuerda reemplazar la de producción cuando la tengas.
export const WOMPI_PUBLIC_KEY_SANDBOX = 'pub_test_byTgToTmnJqkYfgnxYcZOvpA8lB8sH2Q';
export const WOMPI_PUBLIC_KEY_PROD = 'pub_prod_...'; // 👈 REEMPLAZA CON TU LLAVE PÚBLICA DE PRODUCCIÓN

// Elige la llave pública correcta según el modo
export const WOMPI_PUBLIC_KEY = IS_TEST_MODE ? WOMPI_PUBLIC_KEY_SANDBOX : WOMPI_PUBLIC_KEY_PROD;

// 2. Endpoint del Backend de Pagos en Google Cloud Run
// Esta URL apunta a la función que maneja la lógica de pagos (firmas y suscripciones).
export const GCF_PAYMENT_ENDPOINT = 'https://wompi-pagos-74774071959.us-central1.run.app';