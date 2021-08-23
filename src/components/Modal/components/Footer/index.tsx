interface FooterProps {
  children: any;
}

function Footer ({ children }: FooterProps) {
  return (
    <div className="Vlt-modal__footer">
      {children}
    </div>
  )
}

export default Footer;
