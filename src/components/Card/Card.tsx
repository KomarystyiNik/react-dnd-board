import clsx from 'clsx';
import { FC, useRef } from 'react';
import { DragSourceMonitor, useDrag, useDrop, XYCoord } from 'react-dnd';
import classes from './styles.module.css';

export interface CardProps {
  index: number;
  id: string;
  info: string;
  title: string;
  column: string;
  moveCard: (
    dragIndex: number,
    hoverIndex: number,
    dragColumn: string,
    hoverColumn: string
  ) => void;
  onDelete: (column: string, id: string) => void;
}

export const CARD_TYPE = {
  CARD: 'card',
};

export const Card: FC<CardProps> = ({
  index,
  id,
  info,
  title,
  column,
  moveCard,
  onDelete,
}) => {
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop<{ index: number; column: string; id: string }>({
    accept: CARD_TYPE.CARD,
    hover: (item, monitor) => {
      if (!dropAreaRef.current) {
        return;
      }

      const { index: dragIndex, column: dragColumn } = item;
      const hoverIndex = index;
      const hoverColumn = column;

      if (dragColumn === hoverColumn) {
        if (dragIndex === hoverIndex) {
          return;
        }

        const hoverBoundingRect = dropAreaRef.current?.getBoundingClientRect();

        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        const clientOffset = monitor.getClientOffset();

        const hoverClientY =
          (clientOffset as XYCoord).y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }

        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }

        moveCard(dragIndex, hoverIndex, dragColumn, hoverColumn);

        item.index = hoverIndex;
        return;
      }

      moveCard(dragIndex, hoverIndex, dragColumn, hoverColumn);

      item.index = hoverIndex;
      item.column = hoverColumn;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag<
    {
      index: number;
      column: string;
      id: string;
    },
    unknown,
    {
      isDragging: boolean;
    }
  >({
    type: CARD_TYPE.CARD,
    item: { index, column, id },
    collect: (
      monitor: DragSourceMonitor<{ index: number; column: string; id: string }>
    ) => ({
      isDragging: id === monitor.getItem()?.id,
    }),
  });

  drop(drag(dropAreaRef));
  preview(previewRef);

  const handleDelete = () => onDelete(column, id);

  return (
    <div
      ref={previewRef}
      className={clsx({
        [classes.cardContainer]: true,
        [classes.cardContainerDragged]: isDragging,
      })}
    >
      <div className={classes.card} ref={dropAreaRef}>
        <h3>{title}</h3>
        <hr className={classes.divider} />
        <p className={classes.info}>{info}</p>
        <button className={classes.deleteButton} onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};
