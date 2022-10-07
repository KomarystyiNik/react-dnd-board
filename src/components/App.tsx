import { useCallback, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';

import { getData, saveData } from '../utils/StorageUtils';
import { AddCardModal, AddColumnModal, Card, Column, Board } from '.';

export type Item = {
  id: string;
  title: string;
  info: string;
};

export type Items = Record<string, Item[]>;

export const App = () => {
  const [cards, setCards] = useState<Items>({});

  const possibleColumns = Object.keys(cards);
  const canAddCard = possibleColumns.length !== 0;

  useEffect(() => {
    if (!Object.keys(cards).length) return;

    saveData('board', cards);
  }, [cards]);

  useEffect(() => {
    const data = getData<Items>('board');

    if (!data) return;

    setCards(data);
  }, []);

  const moveCard = useCallback(
    (
      dragIndex: number,
      hoverIndex: number,
      dragColumn: string,
      hoverColumn: string
    ) => {
      if (dragColumn === hoverColumn) {
        return setCards((prevCards) => {
          const copy = [...prevCards[dragColumn]];

          copy.splice(dragIndex, 1);
          copy.splice(hoverIndex, 0, prevCards[dragColumn][dragIndex]);

          return { ...prevCards, [dragColumn]: copy };
        });
      }

      setCards((prevCards) => {
        const copyDragColumn = [...prevCards[dragColumn]];
        const copyHoverColumn = [...prevCards[hoverColumn]];

        copyDragColumn.splice(dragIndex, 1);
        copyHoverColumn.splice(hoverIndex, 0, prevCards[dragColumn][dragIndex]);

        return {
          ...prevCards,
          [dragColumn]: copyDragColumn,
          [hoverColumn]: copyHoverColumn,
        };
      });
    },
    []
  );

  const addCard = (
    dragIndex: number,
    dragColumn: string,
    hoverColumn: string
  ) => {
    setCards((prevCards) => {
      const copyDragColumn = [...prevCards[dragColumn]];
      const copyHoverColumn = [...prevCards[hoverColumn]];

      copyDragColumn.splice(dragIndex, 1);
      copyHoverColumn.push(prevCards[dragColumn][dragIndex]);

      return {
        ...prevCards,
        [dragColumn]: copyDragColumn,
        [hoverColumn]: copyHoverColumn,
      };
    });
  };

  const handleDeleteColumn = (columnName: string) =>
    setCards(({ [columnName]: _, ...restColumns }) => ({
      ...restColumns,
    }));

  const handleDeleteCard = (column: string, id: string) => {
    setCards((prevCards) => {
      const copyColumn = [...prevCards[column]];
      const index = copyColumn.findIndex((card) => card.id === id);

      copyColumn.splice(index, 1);

      return {
        ...prevCards,
        [column]: copyColumn,
      };
    });
  };

  const handleAddCard = (title: string, info: string, columnName: string) =>
    setCards((prevState) => ({
      ...prevState,
      [columnName]: [
        ...prevState[columnName],
        {
          info,
          title,
          id: uuidv4(),
        },
      ],
    }));

  const handleAddColumn = (columnName: string) =>
    setCards((prevState) => ({ ...prevState, [columnName]: [] }));

  return (
    <DndProvider backend={HTML5Backend}>
      <Board
        title="Board"
        boardOptions={
          <>
            {canAddCard && (
              <AddCardModal
                columns={possibleColumns}
                onAddCard={handleAddCard}
              />
            )}
            <AddColumnModal onAddColumn={handleAddColumn} />
          </>
        }
      >
        {Object.keys(cards).map((innerCardsKey) => (
          <Column
            key={innerCardsKey}
            column={innerCardsKey}
            addCard={addCard}
            onDelete={handleDeleteColumn}
          >
            {cards[innerCardsKey].map(({ id, info, title }, index) => (
              <Card
                key={index}
                id={id}
                info={info}
                title={title}
                index={index}
                column={innerCardsKey}
                moveCard={moveCard}
                onDelete={handleDeleteCard}
              />
            ))}
          </Column>
        ))}
      </Board>
    </DndProvider>
  );
};
