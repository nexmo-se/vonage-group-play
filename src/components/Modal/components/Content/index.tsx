interface ContentProps {
  children: any;
}

function Content ({ children }: ContentProps) {
  return (
    <div className="Vlt-modal__content">
      {children}
    </div>
  )
}

export default Content;
