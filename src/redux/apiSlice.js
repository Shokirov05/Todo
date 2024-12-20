import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
    tagTypes: ["Todos"],
    endpoints: (builder) => ({
      getTodos: builder.query({
        query: () => "/todos",
        providesTags: ["Todos"],
      }),
      addTodo: builder.mutation({
        query: (newTodo) => ({
          url: "/todos",
          method: "POST",
          body: newTodo,
        }),
        invalidatesTags: ["Todos"],
      }),
      updateTodo: builder.mutation({
        query: ({ id, ...updatedFields }) => ({
          url: `/todos/${id}`,
          method: "PATCH",
          body: updatedFields,
        }),
        invalidatesTags: ["Todos"],
      }),
      deleteTodo: builder.mutation({
        query: (id) => ({
          url: `/todos/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Todos"],
      }),
    }),
  });
  
  export const {
    useGetTodosQuery,
    useAddTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation,
  } = apiSlice;
  