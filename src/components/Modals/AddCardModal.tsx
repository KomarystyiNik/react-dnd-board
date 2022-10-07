import { FC, useState, FormEvent } from 'react';
import { Modal } from '../Modal';
import classes from './styles.module.css';

export interface AddCardModalProps {
  columns: string[];
  onAddCard: (title: string, info: string, columnName: string) => void;
}

export const AddCardModal: FC<AddCardModalProps> = ({ columns, onAddCard }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (event.target instanceof HTMLFormElement) {
      const formData = new FormData(event.target);

      const cardTitle = formData.get('title');
      const cardInfo = formData.get('info');
      const columnName = formData.get('columnName');

      if (!cardTitle || !cardInfo || !columnName) {
        event.preventDefault();
        return;
      }

      onAddCard(cardTitle as string, cardInfo as string, columnName as string);
      event.target.reset();
    }
  };

  return (
    <>
      <button onClick={handleOpen}>Add new card</button>
      <Modal open={open} onClose={handleClose}>
        <form method="dialog" className={classes.form} onSubmit={handleSubmit}>
          <fieldset className={classes.fieldset}>
            <legend>Add new card</legend>

            <div className={classes.inputContainer}>
              <label htmlFor="title">Card title: </label>
              <input required id="title" name="title" type="text" />
            </div>

            <div className={classes.inputContainer}>
              <label htmlFor="info">Card info: </label>

              <textarea required id="info" name="info" />
            </div>

            <div className={classes.inputContainer}>
              <label htmlFor="columnName">Select column: </label>
              <select id="columnName" name="columnName">
                {columns.map((name, index) => (
                  <option
                    defaultChecked={index === 0}
                    key={index}
                    value={name}
                    label={name}
                  />
                ))}
              </select>
            </div>
          </fieldset>

          <button type="submit" className={classes.submitButton}>Submit</button>
        </form>
      </Modal>
    </>
  );
};
