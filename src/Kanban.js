import React, { useState } from "react";
import styled from "@emotion/styled";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase.config";

const Container = styled.div`
  display: flex;
`;

const TaskList = styled.div`
  min-height: 100px;
  display: flex;
  flex-direction: column;
  background: #f3f3f3;
  min-width: 341px;
  border-radius: 5px;
  padding: 15px 15px;
  margin-right: 45px;
`;

const TaskColumnStyles = styled.div`
  margin: 8px;
  display: flex;
  width: 100%;
  min-height: 80vh;
`;

const Title = styled.span`
  color: #10957d;
  background: rgba(16, 149, 125, 0.15);
  padding: 2px 10px;
  border-radius: 5px;
  align-self: flex-start;
`;

const Kanban = () => {
  const [completedItems, updateCompletedItems] = useState([]);
  const [todoItems, updateTodoItems] = useState([]);
  const [inProgressItems, updateInProgressItems] = useState([]);

  const getData = async () => {
    const docRef1 = doc(
      db,
      "data",
      "users",
      "11001",
      "data",
      "tasks",
      "streaks",
      "1",
      "completed"
    );
    const docSnap1 = await getDoc(docRef1);

    const docRef2 = doc(
      db,
      "data",
      "users",
      "11001",
      "data",
      "tasks",
      "streaks",
      "1",
      "progress"
    );
    const docSnap2 = await getDoc(docRef2);

    const docRef3 = doc(
      db,
      "data",
      "users",
      "11001",
      "data",
      "tasks",
      "streaks",
      "1",
      "todo"
    );
    const docSnap3 = await getDoc(docRef3);

    updateCompletedItems(docSnap1.data()?.items);
    updateInProgressItems(docSnap2.data()?.items);
    updateTodoItems(docSnap3.data()?.items);
  };

  React.useEffect(() => {
    // setDoc(
    //   doc(
    //     db,
    //     "data",
    //     "users",
    //     "11001",
    //     "data",
    //     "tasks",
    //     "streaks",
    //     "1",
    //     "completed"
    //   ),
    //   {
    //     items: [
    //       {
    //         id: "1",
    //         Task: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent.",
    //         image: "google.com",
    //       },
    //       {
    //         id: "2",
    //         Task: "Lore2 ipsum dolor sit amet, consectetur adipiscing elit. Praesent.",
    //         image: "google.com",
    //       },
    //     ],
    //   }
    // );
    getData();
  }, []);

  const columnsFromBackend = {
    [uuidv4()]: {
      title: "To-do",
      items: [
        {
          id: "1",
          Task: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent.",
          // Assigned_To: 'Beltran',
          // Assignee: 'Romona',
          // Status: 'To-do',
          // Priority: 'Low',
          Due_Date: "25-May-2020",
        },
        {
          id: "2",
          Task: "Fix Styling",
          // Assigned_To: 'Dave',
          // Assignee: 'Romona',
          // Status: 'To-do',
          // Priority: 'Low',
          Due_Date: "26-May-2020",
        },
        {
          id: "3",
          Task: "Handle Door Specs",
          // Assigned_To: 'Roman',
          // Assignee: 'Romona',
          // Status: 'To-do',
          // Priority: 'Low',
          Due_Date: "27-May-2020",
        },
        {
          id: "4",
          Task: "morbi",
          // Assigned_To: 'Gawen',
          // Assignee: 'Kai',
          // Status: 'Done',
          // Priority: 'High',
          Due_Date: "23-Aug-2020",
        },
        {
          id: "5",
          Task: "proin",
          // Assigned_To: 'Bondon',
          // Assignee: 'Antoinette',
          // Status: 'In Progress',
          // Priority: 'Medium',
          Due_Date: "05-Jan-2021",
        },
      ],
    },
    [uuidv4()]: {
      title: "In Progress",
      items: inProgressItems,
    },
    [uuidv4()]: {
      title: "Done",
      items: completedItems,
    },
  };

  console.log(columnsFromBackend);
  const [columns, setColumns] = useState(columnsFromBackend);

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };
  return (
    <DragDropContext
      onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
    >
      <Container>
        <TaskColumnStyles>
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <Droppable key={columnId} droppableId={columnId}>
                {(provided, snapshot) => (
                  <TaskList
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <Title>{column.title}</Title>
                    {column.items.map((item, index) => (
                      <TaskCard key={item} item={item} index={index} />
                    ))}
                    {provided.placeholder}
                  </TaskList>
                )}
              </Droppable>
            );
          })}
        </TaskColumnStyles>
      </Container>
    </DragDropContext>
  );
};

export default Kanban;
