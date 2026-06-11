interface WelcomeHeaderProps {
  nombre: string
  negocio: string
}

export function WelcomeHeader({ nombre, negocio }: WelcomeHeaderProps) {
  const fecha = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">
        Hola, {nombre} 👋
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        {negocio} · {fecha}
      </p>
    </div>
  )
}
