import { Children, FC, PropsWithChildren, ReactNode } from 'react';
import classes from './styles.module.css';

export interface BoardProps {
  title: string;
  boardOptions: ReactNode;
}

export const Board: FC<PropsWithChildren<BoardProps>> = ({
  title,
  boardOptions,
  children,
}) => {
  const hasChildren = Children.count(children) !== 0;

  return (
    <div className={classes.board}>
      <h1 className={classes.boardTitle}>{title}</h1>
      <div className={classes.boardOptions}>{boardOptions}</div>
      {hasChildren ? (
        <div className={classes.boardGrid}>{children}</div>
      ) : (
        <div className={classes.placeholder}>
          <span>Please add a column and a card to start using the board</span>
        </div>
      )}
    </div>
  );
};
