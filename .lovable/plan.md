# Pruebas A/B — Laboratorio moderno

## Objetivo
Reemplazar el estado vacío del paso A/B por un panel completo, coherente con el asistente aprobado y con la dirección “Laboratorio moderno”.

## Alcance
- Selector entre distribución por porcentaje y por cantidad.
- Límite total de redirecciones con explicación del comportamiento al alcanzarlo.
- Variantes editables con URL, peso o cuota, identificador, copiar, reordenar y eliminar.
- Validación en vivo de la suma de porcentajes y acción para añadir variantes.
- Guardado de configuración, finalización manual y eliminación del experimento.
- Sección de conversiones con IDs copiables, clics, conversiones, tasa y embudo visual por variante.
- Estados de confirmación accesibles y adaptación móvil/escritorio.

## Detalles técnicos
- Mantener todo en el componente actual del modal y usar los controles y tokens visuales existentes.
- Usar estado local demostrable para los flujos de edición, guardado, copia, reordenamiento, finalización y eliminación.
- Actualizar el roadmap y verificar el flujo completo en el navegador, incluyendo móvil.
