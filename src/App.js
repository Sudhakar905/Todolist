import React, { useEffect, useState } from 'react';
import './App.css';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState("");
  const [currentEditedItem, setCurrentEditedItem] = useState("");

  const handleAddTodo = () => {
    let newTodoItem = {
      title: newTitle,
      Description: newDescription
    };
    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem);
    setTodos(updatedTodoArr);
    localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
    setNewTitle(""); // Clear the title input
    setNewDescription(""); // Clear the description input
  };

  const handleDeleteTodo = (index) => {
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1);
    localStorage.setItem('todolist', JSON.stringify(reducedTodo));
    setTodos(reducedTodo);
  };

  const handleComplete = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let CompletedOn = dd + "-" + mm + "-" + yyyy + ' at ' + h + ':' + m + ':' + s;

    let filteredItem = {
      ...allTodos[index],
      CompletedOn: CompletedOn
    };
    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push(filteredItem);
    setCompletedTodos(updatedCompletedArr);
    localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedArr));
    
    handleDeleteTodo(index);
  };

  const handleDeleteCompletedTodo = (index) => {
    let reducedTodo = [...completedTodos];
    reducedTodo.splice(index, 1); // Corrected to remove one item at the specified index
    localStorage.setItem('completedTodos', JSON.stringify(reducedTodo));
    setCompletedTodos(reducedTodo);
  };

  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem('todolist')) || [];
    let savedCompletedTodo = JSON.parse(localStorage.getItem('completedTodos')) || [];

    setTodos(savedTodo);
    setCompletedTodos(savedCompletedTodo);
  }, []);

  const handleEdit = (index, item) => {
    setCurrentEdit(index);
    setCurrentEditedItem(item);
  };

  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) => ({
      ...prev, title: value
    }));
  };

  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev) => ({
      ...prev, Description: value
    }));
  };

  const handleUpdateToDo = () => {
    let updatedTodos = [...allTodos];
    updatedTodos[currentEdit] = currentEditedItem;
    setTodos(updatedTodos);
    localStorage.setItem('todolist', JSON.stringify(updatedTodos));
    setCurrentEdit("");
    setCurrentEditedItem("");
  };

  return (
    <div className="App">
      <h1>My Todos</h1>
      <div className='todo-wrapper'>
        <div className='todo-input'>
          <div className='todo-input-item'>
            <label>Title</label>
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="What's the task title?" />
          </div>
          <div className='todo-input-item'>
            <label>Description</label>
            <input type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="What's the task description?" />
          </div>
          <div className='todo-input-item'>
            <button type="button" onClick={handleAddTodo} className='primaryBtn'>Add</button>
          </div>
        </div>
        <div className='btn-area'>
          <button className={`secondaryBtn ${isCompleteScreen === false && 'active'}`} onClick={() => setIsCompleteScreen(false)}>Todo</button>
          <button className={`secondaryBtn ${isCompleteScreen === true && 'active'}`} onClick={() => setIsCompleteScreen(true)}>Completed</button>
        </div>
        <div className='todo-list'>
          {isCompleteScreen === false && 
          allTodos.map((item, index) => {
            if (currentEdit === index) {
              return (
                <div className='edit_wrapper' key={index}>
                  <input placeholder='Update Title'
                    onChange={(e) => handleUpdateTitle(e.target.value)}
                    value={currentEditedItem.title} />
                  <textarea placeholder='Update Description'
                    rows={4}
                    onChange={(e) => handleUpdateDescription(e.target.value)}
                    value={currentEditedItem.Description} />
                  <button type="button"
                    onClick={handleUpdateToDo}
                    className='primaryBtn'>
                    Update
                  </button>
                </div>
              );
            } else {
              return (
                <div className='todo-list-item' key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.Description}</p>
                  </div>
                  <div>
                    <AiOutlineDelete className='icon' 
                    onClick={() => handleDeleteTodo(index)} 
                    title="Delete?" />
                    <BsCheckLg className='check-icon'
                     onClick={() => handleComplete(index)} 
                     title="Complete?" />
                     <AiOutlineEdit className='check-icon'
                     onClick={() => handleEdit(index, item)} 
                     title="Edit?" />
                  </div>
                </div>
              );
            }
          })}

          {isCompleteScreen === true &&
           completedTodos.map((item, index) => {
            return (
              <div className='todo-list-item' key={index + 'completed'}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.Description}</p>
                  <p><small>Completed on: {item.CompletedOn}</small></p>
                </div>
                <div>
                  <AiOutlineDelete className='icon' onClick={() => handleDeleteCompletedTodo(index)} title="Delete?" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
