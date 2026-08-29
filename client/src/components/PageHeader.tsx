interface PageHeaderProps {
  eyebrow: string
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-indigo-200">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-slate-300">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  )
}
