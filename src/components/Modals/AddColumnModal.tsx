import { FC, FormEvent, useState } from 'react';
import { Modal } from '../Modal';
import classes from './styles.module.css';

export interface AddColumnModalProps {
  onAddColumn: (columnName: string) => void;
}

export const AddColumnModal: FC<AddColumnModalProps> = ({ onAddColumn }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (event.target instanceof HTMLFormElement) {
      const formData = new FormData(event.target);

      const columnName = formData.get('name');

      if (!columnName) {
        event.preventDefault();
        return;
      }

      onAddColumn(columnName as string);
      event.target.reset();
    }
  };

  return (
    <>
      <button onClick={handleOpen}>Add new column</button>
      <Modal open={open} onClose={handleClose}>
        <form method="dialog" className={classes.form} onSubmit={handleSubmit}>
          <fieldset className={classes.fieldset}>
            <legend>Add new column</legend>

            <div className={classes.inputContainer}>
              <label htmlFor="name">Column name: </label>
              <input required id="name" name="name" type="text" />
            </div>
          </fieldset>

          <button type="submit" className={classes.submitButton}>
            Submit
          </button>
        </form>
      </Modal>
    </>
  );
};
