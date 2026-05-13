import Todo from "../models/todo.model.js";

const findAll = async (userId) => {
  return await Todo.find({ userId }).sort({ completed: 1, createdAt: -1 });
};

const findById = async (todoId, userId) => {
  return await Todo.findOne({
    _id: todoId,
    userId: userId,
  });
};

const createTodo = async (userId, title, description, completed) => {
  return await Todo.create({
    userId: userId,
    title: title,
    description: description,
    completed: completed,
  });
};

const updateTodo = async (todoId, userId, title, description, completed) => {
  const updatedTodo = await Todo.findOneAndUpdate(
    {
      _id: todoId,
      userId: userId,
    },
    { title, description, completed },
    { returnDocument: "after", runValidators: true },
  );

  if (!updatedTodo) {
    const error = new Error("Todo not found");
    error.statusCode = 404;
    throw error;
  }

  return updatedTodo;
};

const deleteTodo = async (todoId, userId) => {
  const todo = await Todo.findOne({
    _id: todoId,
    userId: userId,
  });

  if (!todo) {
    const error = new Error("Todo not found");
    error.statusCode = 404;
    throw error;
  }

  return await todo.deleteOne();
};

export { findAll, findById, updateTodo, deleteTodo, createTodo };
