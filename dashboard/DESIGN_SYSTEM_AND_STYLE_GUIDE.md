# Formuletry — Design System, UX/UI Guidelines & Telemetry Style Guide

> **Propósito**: Guía completa de diseño, tokens visuales, tipografía, paleta de colores y componentes para replicar exactamente la estética de **Formuletry** en el módulo de Telemetría y Live Timing.

---

## 1. Filosofía de Diseño y Estética Central

- **Aesthetic**: *Apple Dark Glassmorphism* + *F1 Official Telemetry Rigor*.
- **Vibe**: Software de ingeniería automotriz de alta gama, sobrio, sin estridencias, táctil y ultra refinado (estilo iOS 18 / macOS Sequoia / F1 timing dashboard profesional).
- **Densidad de información**: Compacta, contenida y legible. Nunca saturada ni con letras desproporcionadas. 
- **Cero genérico**: Evitar bordes redondeados toscos sin proporción, sombras duras o colores neón planos. Se usan efectos de luz sutiles (`inset 0 1px 0 rgba(255,255,255,0.1)`), materiales translúcidos (`backdrop-blur-xl`) y hairline borders (`border-white/[0.08]`).

---

## 2. Paleta de Colores y Tokens (Tailwind v4)

### Fondos y Superficies (Dark Ground System)
```css
--color-f1-ground:   #0F1015; /* Fondo principal de la app (nunca negro puro #000000) */
--color-f1-surface:  #12131A; /* Tarjetas principales y contenedores (90-95% opacidad) */
--color-f1-sheet:    #161822; /* Modales, popovers y bottom sheets */
```

### Acentos de Estado y Telemetría
```css
--color-f1-accent:        #E10600; /* F1 Official Red */
--color-f1-accent-bright: #FF453A; /* Apple System Red (badges, focus rings) */
--color-f1-done:          #10B981; /* Verde Live / Delta negativo / Sector récord (#4ADE9A / emerald-400) */
--color-f1-sprint:        #F59E0B; /* Ámbar P1 / Sector personal rápido (#F5B841 / amber-400) */
--color-f1-rain:          #38BDF8; /* Cyan lluvia / Neumáticos Wet (#0093CC / sky-400) */
--color-f1-purple:        #A855F7; /* Morado récord absoluto de vuelta / Fastest lap (purple-400) */
```

### Escala de Textos (Jerarquía de Contraste sobre `#0F1015`)
- **Títulos y valores principales**: `text-white` o `text-white/95` (`#FFFFFF`).
- **Subtítulos y nombres secundarios**: `text-white/60` a `text-white/70`.
- **Labels, encabezados de columnas y deltas**: `text-white/40` a `text-white/35`.
- **Divisores y líneas tenues**: `border-white/[0.05]` a `border-white/[0.08]`.

---

## 3. Tipografía y Reglas de Formato Numérico

### Familias Tipográficas
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif;
```
- **Tracking**:
  - Encabezados: `tracking-[-0.02em]` o `tracking-[-0.01em]`.
  - Textos de lectura: `tracking-tight` (`-0.015em`).
  - Etiquetas/Caps: `tracking-wider` o `tracking-widest` (en fuentes enanas `text-[9px]` a `text-[10px]`).

### ⚠️ Regla de Oro para Telemetría: `font-mono tabular-nums`
**Cualquier número, tiempo de vuelta, sector, delta de tiempo, velocidad o posición DEBE usar `font-mono tabular-nums`**.
Esto evita que los dígitos oscilen en ancho ("jitter") cuando los datos cambian en tiempo real.

### Tamaños contenidos de Telemetría:
- Encabezados de columnas (POS, PILOTO, DIF, S1, S2, S3, VUELTA): `text-[10px]` o `text-[10.5px] font-semibold text-white/35 uppercase`.
- Nombres de pilotos: `text-[12.5px] font-semibold text-white/95 truncate`.
- Tiempos de vuelta y deltas: `text-[11.5px]` o `text-[12px] font-mono tabular-nums`.
- Deltas positivos/negativos: `text-[9.5px]` a `text-[10.5px]`.

---

## 4. Componentes y Patrones UI

### A. Apple Glass Cards (Tarjetas de datos y telemetría)
```tsx
<div className="relative overflow-hidden rounded-2xl bg-[#12131A]/95 border border-white/[0.08] p-3.5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.10)]">
  {/* Gradiente radial ambiental muy suave en una esquina */}
  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
  {/* Contenido en z-10 */}
</div>
```

### B. Segmented Controls / Filtros iOS (ej. S1 / S2 / S3 o Sectores / Neumáticos)
```tsx
<div className="flex items-center gap-1 p-1 rounded-full bg-white/[0.04] border border-white/[0.07] backdrop-blur-xl">
  <button className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-white/[0.14] border border-white/[0.16] shadow-sm">
    General
  </button>
  <button className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white/50 hover:text-white transition-colors">
    Sectores
  </button>
</div>
```

### C. Apple Glass Floating Dock / Pills
```tsx
<nav className="pointer-events-none fixed bottom-4 inset-x-4 md:inset-x-0 z-30 flex justify-center">
  <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full bg-[#10121A]/85 backdrop-blur-2xl border border-white/[0.10] shadow-[0_16px_40px_-6px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.16)]">
    {/* Botones de navegación */}
  </div>
</nav>
```

### D. Badges de Estado y Sector
- **Sector récord (Purpura)**: `bg-purple-500/15 text-purple-300 border border-purple-500/25`
- **Sector verde (Personal mejor)**: `bg-emerald-500/15 text-emerald-400 border border-emerald-500/25`
- **Sector amarillo (Sin mejora)**: `bg-amber-500/15 text-amber-400 border border-amber-500/25`
- **Bandera Roja / Peligro**: `bg-rose-500/15 text-rose-400 border border-rose-500/25`
- **En vivo**: Pulso esmeralda `w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse`

---

## 5. Micro-interacciones y Animaciones (Framer Motion)

- **Físicas de resorte tipo Apple**:
  ```tsx
  transition={{ type: 'spring', stiffness: 500, damping: 32 }}
  ```
- **Feedback táctil (Tap)**:
  - Botones y pills: `whileTap={{ scale: 0.95 }}`
  - Tarjetas y filas: `whileTap={{ scale: 0.985 }}`
- **Accesibilidad**: Envolver en `<MotionConfig reducedMotion="user">` para respetar a usuarios con reducción de movimiento.

---

## 6. Viewport y Ergonomía Móvil

1. **Sin scroll exterior ni rebotes grises**:
   - `html, body, #root` con `height: 100dvh; overflow: hidden; overscroll-behavior: none; background: #0F1015;`.
   - El scroll ocurre exclusivamente dentro de un contenedor interno con `overflow-y-auto`.
2. **Padding inferior de seguridad**:
   - En vistas móviles con dock flotante, el contenedor de scroll siempre lleva `pb-28 md:pb-32` para que ningún dato quede tapado por la barra de navegación.
3. **Anchos en PC (Desktop Layout)**:
   - Contenedor central: `max-w-4xl mx-auto px-4 md:px-8`.
   - Grilla Bento: `grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4`. Los banners anchos ocupan `col-span-1 md:col-span-2`.

