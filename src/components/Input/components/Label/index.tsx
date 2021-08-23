interface LabelProps {
  label: string;
  htmlFor?: string;
}

function Label ({ label, htmlFor }: LabelProps) {
  return (
    <label
      className="Vlt-label"
      htmlFor={htmlFor}
    >
      {label}
    </label>
  )
}

export default Label;
