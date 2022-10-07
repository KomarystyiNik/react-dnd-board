import clsx from 'clsx';
import { FC, MouseEvent, PropsWithChildren, useEffect, useRef } from 'react';

import classes from './styles.module.css';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  open,
  children,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!dialogRef.current) return;

    open ? dialogRef.current.showModal() : dialogRef.current.close();
  }, [open]);

  const handleCloseButton = () => {
    dialogRef.current?.close();
  };

  const handleDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target instanceof HTMLDialogElement) {
      const rect = event.target.getBoundingClientRect();

      const {
        top: dialogTopOffset,
        left: dialogLeftOffset,
        right: dialogRightOffset,
        bottom: dialogBottomOffset,
      } = rect;

      const { clientX: pointerOffsetX, clientY: pointerOffsetY } = event;

      let isInDialog =
        dialogTopOffset <= pointerOffsetY &&
        dialogBottomOffset >= pointerOffsetY &&
        dialogLeftOffset <= pointerOffsetX &&
        dialogRightOffset >= pointerOffsetX;

      if (isInDialog) return;

      event.target.close();
    }
  };

  return (
    <dialog
      className={classes.dialog}
      ref={dialogRef}
      onClose={onClose}
      onClick={handleDialogClick}
    >
      <button
        className={clsx(classes.iconButton, classes.closeButton)}
        onClick={handleCloseButton}
      >
        &#10006;
      </button>
      {children}
    </dialog>
  );
};
