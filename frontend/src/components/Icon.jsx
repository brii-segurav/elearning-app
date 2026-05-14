/**
 * Icon — componente reutilizable para iconos SVG del sprite público.
 *
 * Uso:
 *   <Icon id="book" size={24} className="text-primary" />
 *
 * Los IDs disponibles están en /public/icons.svg (prefijo "icon-").
 */
export default function Icon({ id, size = 20, className = "", style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <use href={`/icons.svg#icon-${id}`} />
    </svg>
  )
}
