import React, { useState, useEffect } from "react";

export const Todolist = () => {

    // Variables

    const APIurl = 'https://playground.4geeks.com/apis/fake/todos/user/xXcarlos117Xx2';


    // Estados
    const [activeIndex, setActiveIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [listaTareas, setListaTareas] = useState([]);


    // - API general check

    async function APICall(url, options) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                console.log('Error: ' + response.status, response.statusText);
                return response.status;
            }

            const contentType = response.headers.get('content-type');
            try {
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                } else {
                    console.log('Error, content is not a JSON, is:', contentType);
                    return null;
                }
            } catch (error) {
                console.error('Error... but i have not idea why, take a look:', error);
                return null;
            }

        } catch (error) {
            console.error('Error in fetch:', error);
            return null;
        }
    }

    // - Ver las tareas - GET

    async function getTask(url) {
        try {
            const APIResponse = await APICall(url);
            if (APIResponse === null || APIResponse === 404) {
                console.error('Error 404 but not handled... how did you do that??:', error);
            } else {
                if (APIResponse.filter(task => task.label === "example task").length === 1) {
                    setListaTareas([]);
                } else {
                    setListaTareas(APIResponse);
                }
            }
        } catch (error) {
            await createUser(url);
            setListaTareas([]);
        }
    }

    // - Añadir tarea - PUT

    async function setTask(url, label) {
        try {
            getTask(url);
            const options = {
                method: 'PUT',
                body: JSON.stringify([...listaTareas, { 'label': label, 'done': false }]),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            await APICall(url, options);
            getTask(url);

        } catch (error) {
            console.error('Error updating task:', error);

        }
    }

    // - Borrar tarea - DEL / PUT

    async function delTask(url, i) {
        try {
            const newList = [...listaTareas];
            newList.splice(i, 1);

            if (newList.length <= 0) {
                console.log('User deleted');
                deleteUser(url);

            } else {
                const options = {
                    method: 'PUT',
                    body: JSON.stringify([...newList]),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                await APICall(url, options);
            }
            getTask(url);

        } catch (error) {
            console.error('I didnt expect this to happen, but you caused this error: ', error);
        }
    }

    // - Create a user - POST

    async function createUser(url) {
        const options = {
            method: 'POST',
            body: JSON.stringify([]),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        await APICall(url, options);
    }

    //- Delete a user - DEL

    async function deleteUser(url) {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        await APICall(url, options);
    }

    // onChange

    function handleChange(event) { setInputValue(event.target.value) };

    
    // onSubmit

    async function handleSubmit(event) {
        event.preventDefault();
        if (inputValue.trim() !== "") {
            await setTask(APIurl, inputValue.trim());
            setInputValue("");
        }
    };

    
    // Función para seleccionar el ID

    function handleSelect(i) { setActiveIndex(i); };

    // Usamos getTask() por que:
    // 1. En caso de no tener creado un usuario, lo crea para poder almacenar las tareas.
    // 2. En caso de tener un usuario creado con tareas, las trae de vuelta y asi podemos verlas.
    
    useEffect(() => {
        getTask(APIurl);
    },[]);

    // HTML

    return (
        <div className="container">
            <h1 className="text-secondary text-center mt-5">Lista de tareas</h1>
            <div className="row d-flex justify-content-center">
                <form className="col-xs-auto col-md-6" onSubmit={handleSubmit}>
                    <input className="form-control" type='text' value={inputValue} onChange={handleChange} placeholder="Regar las plantas" />
                </form>
            </div>
            <div className="row d-flex justify-content-center">
                <ul className="col-xs-auto col-md-6 list-group mt-4">

                    {/* Se realiza un .map solo en caso de que "listaTareas" no sea null o su longitud sea 0, previene errores de iteración. */}

                    {listaTareas !== null && listaTareas.length > 0 ? (
                        listaTareas.map((tarea, i) => (
                            <li className="list-group-item d-flex justify-content-between align-items-center text-wrap text-break" key={i} onMouseEnter={() => handleSelect(i)} onMouseLeave={() => handleSelect(null)}>
                                {tarea.label}
                                <button className={`btn btn-close${activeIndex === i ? '' : 'visually-hidden'}`} onClick={() => delTask(APIurl, i)} key={i}></button>
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item d-flex justify-content-between align-items-center text-wrap text-break">
                            No hay tareas todavía, añade alguna!
                        </li>
                    )}

                </ul>
                <div className="row d-flex justify-content-center">
                    <div className="col-xs-auto col-md-6 text-end mt-3">{listaTareas == null ? '0' : listaTareas.length} tareas</div>
                </div>
            </div>
        </div>
    );
}