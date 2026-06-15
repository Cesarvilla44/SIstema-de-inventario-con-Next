# Guion para Video Demo Técnica (4:30 minutos)

## 0:00–0:30: Contexto

**Visual**: Pantalla con el sistema de inventario abierto, mostrando la página principal

**Guion**:
"Hola, soy [Tu Nombre] y hoy quiero mostrarte mi Sistema de Inventario. Este sistema está diseñado para pequeñas y medianas empresas que necesitan gestionar su inventario de productos, categorías, órdenes y transferencias de manera eficiente."

**Visual**: Zoom en las estadísticas principales (productos, categorías, stock total, valor estimado)

**Guion**:
"El problema que resuelve es la falta de visibilidad en tiempo real del inventario. Antes, las empresas tenían que actualizar spreadsheets manualmente, lo que causaba errores y desincronización. Con este sistema, tienen una vista centralizada y actualizada en tiempo real de todo su inventario."

**Visual**: Mostrar el menú lateral con las diferentes secciones (General, Inventario, Órdenes, Transferencias, Reportes)

**Guion**:
"El sistema permite gestionar productos y categorías, crear órdenes de compra, registrar transferencias entre almacenes, y generar reportes de inventario. Todo en una interfaz moderna y responsive que funciona en cualquier dispositivo."

---

## 0:30–2:00: Demo del Producto

**Visual**: Volver a la página de inventario, mostrar la tabla de productos

**Guion**:
"Vamos a ver cómo funciona el sistema en la práctica. Aquí tenemos el panel de inventario con todos los productos. Puedo filtrar por nombre, categoría o stock mínimo."

**Visual**: Hacer una búsqueda de "monitor" y mostrar cómo se filtra

**Guion**:
"Por ejemplo, si busco 'monitor', el sistema filtra instantáneamente los resultados. También puedo filtrar por categoría o por stock mínimo."

**Visual**: Mostrar el botón "+ Producto" y crear un nuevo producto

**Guion**:
"Para añadir un nuevo producto, simplemente hago clic en '+ Producto', lleno el formulario con nombre, descripción, precio, stock y categoría, y el sistema lo crea automáticamente."

**Visual**: Mostrar cómo ajustar el stock con los botones + y -

**Guion**:
"Una de las features más útiles es la actualización de stock en tiempo real. Puedo ajustar el stock de un producto directamente desde la tabla usando los botones + y -."

**Visual**: Abrir el sistema en dos pestañas del navegador

**Guion**:
"Ahora, quiero mostrarte algo interesante. Voy a abrir el sistema en dos pestañas diferentes. En la primera pestaña, voy a ajustar el stock de este producto de 10 a 15."

**Visual**: En la primera pestaña, hacer clic en el botón + varias veces para aumentar el stock

**Guion**:
"Voy a aumentar el stock a 15... y ahora, mira la segunda pestaña. El stock se ha actualizado instantáneamente sin recargar la página."

**Visual**: Mostrar ambas pestañas con el stock sincronizado

**Guion**:
"Esto es posible gracias a Pusher Channels, que permite sincronización en tiempo real entre múltiples usuarios. Si hay varias personas gestionando el inventario simultáneamente, todos ven los cambios en tiempo real."

---

## 2:00–3:30: Arquitectura

**Visual**: Abrir el VS Code y mostrar la estructura del proyecto en el explorador de archivos

**Guion**:
"Ahora, vamos a ver la arquitectura técnica del sistema. El sistema sigue una arquitectura de tres capas: presentación, aplicación y datos."

**Visual**: Expandir la carpeta src/app y mostrar los componentes y páginas

**Guion**:
"En la capa de presentación, tenemos los componentes React y las páginas de Next.js. Aquí es donde el usuario interactúa con la interfaz. Podemos ver que la página principal está dividida en componentes modulares como InventorySidebar, StatsCards, ProductTable, y varios formularios."

**Visual**: Expandir la carpeta src/app/api y mostrar las rutas de la API

**Guion**:
"Las API Routes de Next.js manejan la lógica de negocio. Tenemos endpoints para productos, categorías, órdenes, transferencias y reportes. Cada endpoint valida los datos, procesa las operaciones y devuelve respuestas en formato JSON estandarizado."

**Visual**: Abrir el archivo prisma/schema.prisma

**Guion**:
"La capa de datos usa PostgreSQL con Prisma ORM. Aquí podemos ver el schema que define nuestros modelos: Category, Product, Order, Transfer, Report y Settings. Prisma nos proporciona type safety automática y una excelente developer experience."

**Visual**: Mostrar el archivo src/hooks/useInventoryMutations.ts

**Guion**:
"El flujo de datos es unidireccional: el usuario interactúa con la UI, React Query hace fetch a las API Routes, las API Routes usan Prisma para consultar PostgreSQL, y los datos retornan a través de React Query cache. React Query proporciona cache automático, revalidación optimista y gestión de loading states."

---

## 3:30–4:30: Reto Técnico

**Visual**: Volver al código, mostrar el archivo page.tsx original (si existe) o mencionar que tenía 771 líneas

**Guion**:
"Uno de los retos técnicos más difíciles que enfrenté fue la refactorización del componente principal page.tsx, que originalmente tenía 771 líneas. Era un componente monolítico que contenía toda la lógica de la página de inventario en un solo archivo."

**Visual**: Mostrar los componentes extraídos (InventorySidebar, StatsCards, ProductTable, etc.)

**Guion**:
"Para solucionar esto, identifiqué las responsabilidades del componente y las extraje en componentes más pequeños y enfocados. Creé 10 componentes nuevos como InventorySidebar, StatsCards, ProductTable, ProductForm, CategoryForm, y varios modales."

**Visual**: Mostrar el hook useInventoryMutations

**Guion**:
"También extraje la lógica de mutations en un hook personalizado llamado useInventoryMutations, lo que separó la lógica de negocio de la UI y mejoró la testabilidad."

**Visual**: Mostrar el archivo src/types/index.ts

**Guion**:
"Además, moví los tipos Category y Product a un archivo separado para que pudieran ser importados por múltiples componentes, mejorando la reutilización del código."

**Visual**: Mostrar page.tsx final con 237 líneas

**Guion**:
"El resultado fue que page.tsx se redujo de 771 a 237 líneas, con una arquitectura más modular y mantenible. Esta refactorización fue un reto porque requería mantener la funcionalidad completa mientras reestructuraba el código, pero al final mejoró significativamente la calidad del código."

**Visual**: Volver a la aplicación funcionando

**Guion**:
"Y eso es mi Sistema de Inventario. Es un proyecto que me permitió aprender sobre arquitectura de componentes, testing, y buenas prácticas de desarrollo. Gracias por ver."
