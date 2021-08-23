import lodash from "lodash";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

import Hint from "./components/Hint";
import Label from "./components/Label";

type OnChangeCallback = (value: string) => void;
type OnChangeDefault = () => void;
type OnChange = Dispatch<SetStateAction<string>> | OnChangeCallback | OnChangeDefault;
interface InputProps {
  id: string;
  label?: any;
  hint?: any;
  type?: string;
  value?: string;
  onChange?: OnChange
}

function Input (props: InputProps) {
  const label = lodash(props).get("label");
  const id = lodash(props).get("id");
  const type = lodash(props).get("type", "text")
  const hint = lodash(props).get("hint");
  const value = lodash(props).get("value", "");
  const onChange = lodash(props).get("onChange", () => {});

  function handleChange (e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value)
  }

  return (
    <div className="Vlt-form__element">
      { label !== undefined && label }
      <div className="Vlt-input">
        <input
          type={type}
          id={id}
          value={value}
          onChange={handleChange}
        />
      </div>
      { hint !== undefined && hint }
    </div>
  )
}

Input.Label = Label;
Input.Hint = Hint;
export default Input;
