// supabase/functions/create-wompi-signature/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

// Función para convertir un ArrayBuffer a un string Hexadecimal
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Considera cambiar esto a tu dominio: 'https://smaiflow.com'
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req: Request) => {
  // Manejar solicitud pre-vuelo de CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { reference, amountInCents } = await req.json();

    if (!reference || !amountInCents) {
      return new Response(
        JSON.stringify({ error: "Faltan los parámetros 'reference' y 'amountInCents'." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Usamos la variable de entorno que coincide con tu captura de pantalla de Supabase.
    // Deno.env.get() lee los "Secrets" que configuraste.
    // FIX: Access the Deno global via globalThis to resolve the "Cannot find name 'Deno'" TypeScript error.
    const integritySecret = (globalThis as any).Deno.env.get("WOMPI_INTEGRITY_SECRET");

    if (!integritySecret) {
      console.error("Error: WOMPI_INTEGRITY_SECRET no está configurado en los secretos de Supabase.");
      return new Response(
        JSON.stringify({ error: "Error de configuración del servidor: Falta el secreto de integridad de Wompi." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const currency = "COP";
    const concatenation = `${reference}${amountInCents}${currency}${integritySecret}`;

    const data = new TextEncoder().encode(concatenation);
    // FIX: Corrected typo from "SHA-26" to "SHA-256" for the hashing algorithm.
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const signature = bufferToHex(hashBuffer);

    return new Response(
      JSON.stringify({ signature: signature }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );

  } catch (error) {
    console.error("Error interno en la función:", error);
    return new Response(
      JSON.stringify({ error: "Ocurrió un error interno en el servidor.", details: error.message }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
});
