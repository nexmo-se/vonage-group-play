interface HintProps {
  label: string;
}

function Hint ({ label }: HintProps) {
  return (
    <small className="Vlt-form__element__hint">
      {label}
    </small>
  )
}

export default Hint;
