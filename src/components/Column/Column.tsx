import clsx from 'clsx';
import { Children, FC, ReactElement, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { CardProps, CARD_TYPE } from '../Card/Card';
import classes from './styles.module.css';

export interface ColumnProps {
  column: string;
  children: ReactElement<CardProps> | ReactElement<CardProps>[];
  addCard: (dragIndex: number, dragColumn: string, hoverColumn: string) => void;
  onDelete: (column: string) => void;
}

export const Column: FC<ColumnProps> = ({
  children,
  column,
  addCard,
  onDelete,
}) => {
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const isolatedAreaRef = useRef<HTMLDivElement>(null);

  const childrenCount = Children.count(children);
  const hasChildren = childrenCount !== 0;

  const [, drop] = useDrop<{ index: number; column: string; id: string }>(
    {
      accept: CARD_TYPE.CARD,
      hover: (item, monitor) => {
        if (!dropAreaRef.current) {
          return;
        }

        const { index: dragIndex, column: dragColumn, id: dragItemId } = item;
        const hoverIndex = childrenCount;
        const hoverColumn = column;

        let hasThisChildren = false;

        Children.forEach(children, (child) => {
          if (child.props.id === dragItemId) {
            hasThisChildren = true;
          }
        });

        if (hasThisChildren) return;

        addCard(dragIndex, dragColumn, hoverColumn);

        item.index = hoverIndex;
        item.column = hoverColumn;
      },
    },
    [childrenCount, column]
  );

  drop(dropAreaRef);

  const handleDelete = () => onDelete(column);

  return (
    <div className={classes.column} ref={isolatedAreaRef}>
      <h2>{column}</h2>
      {children}
      <div
        ref={dropAreaRef}
        className={clsx({
          [classes.columnDropArea]: true,
          [classes.hidden]: hasChildren,
        })}
      />
      {!hasChildren && <button onClick={handleDelete}>Delete column</button>}
    </div>
  );
};
