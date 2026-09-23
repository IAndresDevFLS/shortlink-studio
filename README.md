# Shortlink Studio

Quiero que guiandote de la siguiente guia visual, rediseñes el modal que tengo actualmente para la creacion de shortlinks:
Guía visual de Compacto

Dirección de diseño

Compacto utiliza una estética SaaS técnica, limpia y premium:

Base clara en blanco y gris azulado muy suave.

Verde esmeralda como color identificador y de acción.

Tipografía geométrica en títulos y neutral en lectura.

Bordes finos, sombras discretas y superficies limpias.

Botones principales tipo píldora.

Tarjetas con esquinas redondeadas, sin efectos exagerados.

Iconografía lineal y funcional.

Cuadrícula técnica muy tenue en áreas destacadas.

Animaciones cortas de aparición y desplazamiento vertical.

La interfaz debe sentirse confiable, técnica, accesible y profesional, no decorativa ni recargada.

Paleta principal

UsoColorHexadecimalFondo generalGris azulado casi blanco#F8FAFCSuperficies y tarjetasBlanco#FFFFFFTexto principalAzul carbón#111D2CVerde principalEsmeralda profundo#096C4BVerde secundarioVerde oscuro#0C6A4AVerde/teal complementarioTurquesa#13AE9CFondo de acentoVerde muy pálido#EBF9F5Fondo secundarioGris azulado#EEF2F6Fondo tenueGris muy claro#F2F5F8Texto secundarioGris azulado#52637ATexto secundario fuerteAzul grisáceo#32445DBordesGris azulado claro#DFE4ECError/destructivoRojo#DC2828

Gradiente de marca

El llamado principal emplea un gradiente diagonal de verde esmeralda a teal oscuro:

linear-gradient(135deg, hsl(160 84% 23%), hsl(173 80% 24%))

Debe reservarse para:

Botones principales.

Acentos importantes.

Fondos muy sutiles con baja opacidad.

No debe dominar toda la interfaz.

Regla de uso del color

Verde: acciones principales, iconos relevantes, enlaces y resaltados.

Carbón: títulos y contenido prioritario.

Gris azulado: explicaciones y contenido secundario.

Blanco: tarjetas y superficies elevadas.

Verde pálido: fondos de iconos, etiquetas y estados suaves.

Rojo: solamente errores o acciones destructivas.

Los colores deben aplicarse mediante funciones semánticas —fondo, texto, primario, borde, acento— y no como colores aislados en cada vista.

Tipografía

Familias

FunciónFuenteAlternativasTítulosOutfitInter, system-ui, sans-serifTexto e interfazIntersystem-ui, sans-serifCódigo y datos técnicosJetBrains MonomonospaceLogotipoNunito Mediumsans-serif

Pesos

Títulos principales: 800.

Subtítulos: 700–800.

Títulos de tarjetas: 600.

Botones: 600.

Texto habitual: 400.

Texto secundario destacado: 500.

Etiquetas en mayúsculas: 600.

Escala recomendada

ElementoTamaño habitualH1 principal48 px móvil, 60 px tablet, 68 px escritorioH2 de sección30 px móvil, 36 px tablet, 48 px en bloques destacadosH3/título de tarjeta16–20 pxIntroducción destacada18–20 pxTexto normal16 pxTexto de tarjeta14 pxEtiquetas y ayudas12 pxCódigo14 px

Interlineado

H1: aproximadamente 1.04.

Títulos de sección: compacto, alrededor de 1.15–1.25.

Párrafos: relajado, alrededor de 1.6.

Código: alrededor de 1.6.

Los títulos actuales tienen un espaciado entre letras ligeramente cerrado. Las etiquetas superiores emplean mayúsculas y separación amplia entre letras.

Formas y radios

Botones

Forma principal: píldora completa.

Altura normal: 40 px.

Pequeño: 36 px.

Grande: 48 px.

Botón de icono: 40 × 40 px.

En móvil, controles táctiles: mínimo recomendado de 44 × 44 px.

Tarjetas

Tarjetas principales: radio aproximado de 16 px.

Contenedores técnicos: 12–16 px.

Iconos dentro de tarjetas: contenedor de 44 × 44 px, radio de 12 px.

Elementos compactos de navegación: radio de 8 px.

Etiquetas: píldora completa.

Bordes

Grosor habitual: 1 px.

Color base: #DFE4EC.

Al interactuar, el borde puede pasar a verde con una opacidad baja.

No se utilizan bordes gruesos como decoración.

Sombras y profundidad

Tarjeta normal

0 1px 3px hsl(215 33% 17% / 0.05), 0 1px 2px -1px hsl(215 33% 17% / 0.05)

Tarjeta elevada

0 8px 24px -4px hsl(215 33% 17% / 0.08), 0 2px 6px -2px hsl(215 33% 17% / 0.05)

Resplandor de acción

Se usa un resplandor verde discreto en botones principales. No debe aplicarse a todas las tarjetas.

La profundidad se comunica así:

Fondo general gris claro.

Superficie blanca.

Borde fino.

Sombra mínima.

Sombra algo mayor solamente al destacar o interactuar.

Espaciado y composición

Contenedor

Ancho máximo general: aproximadamente 1200 px.

Centrado horizontal.

Margen lateral habitual: 24 px.

En documentación se usan columnas con contenido central y barras laterales.

Separación vertical

Secciones principales: 80–96 px en móvil y 96–128 px en escritorio.

Separación entre título de sección y contenido: 48 px.

Distancia entre tarjetas: 20 px.

Interior de tarjeta: 24 px.

Botones agrupados: 12 px.

Navegación: altura fija de 64 px.

Rejillas

Tarjetas generales: 1 columna en móvil, 2 en tablet y hasta 3 o 4 en escritorio.

Bloques de producto: 1 columna móvil y 2 columnas desde pantallas medianas.

Las rejillas deben mantener anchos estables y evitar que el contenido cambie el tamaño del conjunto.

Botones y acciones

Acción principal

Fondo con gradiente verde.

Texto blanco semántico.

Forma de píldora.

Peso 600.

Puede incluir flecha a la derecha.

Al pasar el cursor: ligera reducción de opacidad.

Foco: anillo verde visible.

Acción secundaria

Fondo del sitio.

Borde gris fino.

Texto principal.

Al interactuar: fondo gris o verde muy pálido.

Acción discreta

Sin fondo permanente.

Solo cambia el fondo y el texto al interactuar.

Adecuada para navegación, “Sign in” y herramientas secundarias.

Enlaces dentro de contenido

Verde principal.

Subrayado visible en texto corrido.

La navegación puede mantenerse sin subrayado.

Tarjetas

Una tarjeta estándar incluye:

Icono lineal dentro de un cuadrado verde pálido.

Etiqueta opcional en mayúsculas.

Título corto semibold.

Descripción gris de 14 px.

Acción verde al pie cuando corresponda.

Comportamiento:

Borde verde muy suave al pasar el cursor.

Sombra ligeramente más elevada.

Icono con escala mínima, alrededor de 1.05.

Flecha con desplazamiento horizontal muy corto.

No deben colocarse tarjetas decorativas dentro de otras tarjetas.

Etiquetas y encabezados de sección

Las secciones siguen este orden:

Etiqueta pequeña verde o sobre fondo verde pálido.

Título grande y centrado.

Una parte del título puede resaltarse en verde.

Descripción breve en gris azulado.

Contenido principal con margen superior amplio.

Las etiquetas usan:

12 px.

Semibold.

Mayúsculas.

Espaciado amplio entre letras.

Forma de píldora cuando tienen fondo.

Iconografía

La biblioteca visual actual es Lucide:

Trazos lineales.

Tamaño habitual: 16–20 px.

Color verde para acciones o categorías.

Nunca se mezclan iconos rellenos y lineales sin motivo.

Los iconos son funcionales: enlace, llave, gráfica, globo, QR, copiar, menú, flecha.

Un icono solo debe acompañar o aclarar una acción, no usarse como decoración arbitraria.

Fondos y recursos gráficos

Cuadrícula técnica

Cuadrícula de 64 × 64 px.

Líneas grises muy tenues.

Desaparece gradualmente mediante una máscara radial.

Adecuada para cabeceras, llamadas finales y fondos técnicos.

Fondo de cabecera

Combina:

Fondo gris casi blanco.

Malla o degradado muy tenue.

Cuadrícula técnica.

Brillos verdes de muy baja opacidad.

En vistas nuevas debe evitarse añadir manchas de color fuertes o gradientes protagonistas.

Navegación y pie de página

Navegación

Fija en la parte superior.

Altura de 64 px.

Fondo translúcido con desenfoque.

Borde inferior tenue.

Logotipo a la izquierda.

Enlaces al centro.

Accesibilidad, ingreso y llamada principal a la derecha.

En móvil se transforma en menú vertical animado.

Pie de página

Fondo gris tenue.

Borde superior.

Logotipo y frase breve.

Columnas de enlaces por categorías.

Texto de 12–14 px.

Separación final mediante borde horizontal.

Bloques de código

Fuente JetBrains Mono.

Fondo oscuro neutral.

Texto claro.

Contenedor con radio de 12 px y borde.

Encabezado gris opcional con nombre del ejemplo y acción de copiar.

Desplazamiento horizontal controlado.

El código nunca debe romper el ancho de la página.

El botón de copiar muestra confirmación temporal.

Los ejemplos técnicos de una nueva vista deben reutilizar este mismo patrón.

Movimiento

Patrón principal:

Aparición desde opacidad 0 a 1.

Desplazamiento vertical inicial de 12–24 px.

Duración de 0.4–0.6 s.

Retrasos escalonados de alrededor de 0.08 s entre tarjetas.

Cada animación de entrada ocurre una sola vez.

Interacciones:

Transiciones de color: rápidas y suaves.

Tarjetas: aproximadamente 300 ms.

Flechas: desplazamiento mínimo.

No hay rebotes, rotaciones ni movimiento continuo dominante.

El sitio respeta “reducir movimiento”: las animaciones se eliminan casi por completo cuando el sistema del usuario lo solicita.

Adaptación móvil

Punto principal de cambio: alrededor de 768 px.

El menú completo se oculta y aparece el botón de menú.

Los botones principales se apilan verticalmente.

Las rejillas pasan a una columna.

El H1 baja de tamaño sin usar escalado continuo por ancho de pantalla.

Se mantienen márgenes laterales de 24 px.

Tablas y código permiten desplazamiento interno, no de toda la página.

Ninguna vista debe producir desplazamiento horizontal del documento.

Temas alternativos

Tema oscuro

Fondo azul carbón muy oscuro.

Superficies ligeramente más claras.

Texto casi blanco.

Verde principal más luminoso.

Bordes azul grisáceo oscuros.

Se conserva la misma jerarquía y estructura.

Alto contraste

Existe un modo especial con:

Fondo negro.

Texto blanco.

Verde brillante para acciones.

Bordes blancos.

Foco amarillo visible.

Sin sombras, brillos ni gradientes decorativos.

Cuadrícula sin máscara.

Enlaces claramente distinguibles.

Toda vista nueva debe funcionar con los tres estados: claro, oscuro y alto contraste.

Accesibilidad obligatoria

Contraste suficiente entre texto y fondo.

Foco visible en todos los controles.

Objetivos táctiles de al menos 44 px en móvil.

Un solo H1 por página.

Orden jerárquico correcto de títulos.

Texto alternativo en imágenes informativas.

Iconos decorativos ocultos para lectores de pantalla.

Enlace “Saltar al contenido principal”.

Respeto por reducción de movimiento.

No depender solamente del color para comunicar estados.

Menús operables por teclado y cerrables con Escape.

Fórmula para crear nuevas vistas

Para mantener consistencia, una vista nueva debería construirse así:

Navegación fija existente.

Cabecera con fondo técnico tenue.

Etiqueta de categoría.

Un único H1 en Outfit ExtraBold.

Introducción en Inter, gris azulado.

Una acción principal verde y una secundaria con borde.

Secciones con separaciones amplias.

Tarjetas blancas con borde, sombra sutil e iconos verdes.

Código técnico con el bloque oscuro existente cuando aplique.

Llamada final centrada.

Pie de página existente.

La regla principal es: reutilizar los colores semánticos, botones, tarjetas, iconos, espaciados y jerarquías existentes; no diseñar cada vista como una pieza independiente.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7819329f-d146-489e-97aa-fbf26798657c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
