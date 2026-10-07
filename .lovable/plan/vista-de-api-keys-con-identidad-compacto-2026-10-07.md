# Vista de API Keys con identidad Compacto

## Objetivo
Crear una nueva vista `/api-keys` coherente con Dominios, Planes y el dashboard actual, incluyendo los tres momentos del flujo: listado, creación y clave generada, además de la confirmación de eliminación.

## Experiencia
- Encabezado Compacto, navegación de regreso y selector claro/oscuro/alto contraste.
- Resumen breve y tabla limpia de claves con nombre, prefijo, creación, último uso y acciones.
- Estado vacío cuando no existan claves.
- Modal de creación enfocado, con nombre y permisos básicos sin añadir texto innecesario.
- Modal de clave generada con aviso de única visualización, copia accesible y cierre seguro.
- Confirmación de eliminación destructiva, indicando con claridad qué clave se eliminará.
- Datos de demostración en memoria; crear y eliminar actualizará la pantalla mientras esté abierta.

## Dirección visual
- Fondo técnico claro, verde de marca `#096C4B`, títulos Outfit y texto Inter.
- Botones píldora, iconos Lucide lineales, tarjetas con sombra sutil y gradiente solo en la acción principal.
- Mismos tokens y comportamientos accesibles de Compacto, incluidos foco visible y movimiento reducido.

## Alcance técnico
- Añadir la ruta `/api-keys` y componentes de los modales del flujo.
- Añadir acceso desde la cabecera del dashboard sin alterar sus datos o gráficas.
- Incluir metadatos propios de la nueva vista y verificar escritorio, móvil y los tres temas.
- Mantener explícito que la pantalla es una demostración sin generación real de credenciales.
