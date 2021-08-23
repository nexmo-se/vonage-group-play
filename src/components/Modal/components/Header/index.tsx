interface HeaderProps {
  title: string;
}

function Header ({ title }: HeaderProps) {
  return (
    <div className="Vlt-modal__header">
      <h4>{title}</h4>
      
    </div>
  )
}

export default Header;
