import { useEffect, useState } from "react";

export function useModal (id: string) {
  const [modal, setModal] = useState<any>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function init () {
    const modal = (window as any).Volta.modal.create(id);
    setModal(modal);
    return modal;
  }

  function getModal () {
    if (!modal) return init()
    else return modal;
  }

  function open () {
    const modal = getModal()
    modal.open()
    setIsOpen(true);
  }

  function close () {
    const modal = getModal();
    modal.dismiss();
    setIsOpen(false);
    setModal(undefined);
  }

  useEffect(init, [id])

  return {
    isOpen,
    open,
    close
  }
}
