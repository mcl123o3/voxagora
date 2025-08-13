"use client";

import { trpc } from "@/trpc/client";
import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { populate } from "@/app/queries/queries"
import { checkUserExist } from '@/app/actions'
// probar el uso de caching para cargar los datos
//import { caching } => "@/app/caching/caching"

export default function Page() {

  const [filterAuthorId, setFilterAuthorId] = useState<number | null>(null);

  const { data: posts, isLoading, isError, error, refetch } = trpc.getPosts.useQuery({
    published: true,
    authorId: filterAuthorId,
  });
  const { data: authors, isLoading: isLoadingAuthors, isError: isErrorAuthors, error: errorAuthors } = trpc.getAuthors.useQuery();
  const createPostMutation = trpc.createPost.useMutation({
    onSuccess: () => {
      refetch(); // Refetch posts after a new one is created
      setNewPostTitle("");
      setNewPostContent("");
    },
  });

  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedAuthorId, setSelectedAuthorId] = useState<number | string>("");
  const [newPostPublished, setNewPostPublished] = useState(false); // New state for published checkbox

  // Set initial selectedAuthorId once authors are loaded
  // Use useEffect to react to changes in 'authors'
  useEffect(() => {
    if (authors && authors.length > 0 && selectedAuthorId === "") {
      setSelectedAuthorId(authors[0].id); // Set the first author as default
    }
  }, [authors, selectedAuthorId]);

  const handleAuthorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedAuthorId(Number(e.target.value));
  };

  const handleFilterAuthorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterAuthorId(value === "" ? null : Number(value));
  };

  const handleSubmitPost = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim()) {
      alert("El título del post no puede estar vacío.");
      return;
    }
    if (!selectedAuthorId) {
      alert("Por favor, selecciona un autor.");
      return;
    }
    createPostMutation.mutate({
      title: newPostTitle,
      content: newPostContent,
      authorId: Number(selectedAuthorId),
      published: newPostPublished, // Pass the published status
    });
  };

  // para poblar la base de datos se sugiere volver a cargar la pagina.

  const [userExists, setUserExists] = useState<boolean | null>(null);

    useEffect(() => {
        async function checkUser() {
            const exists = await checkUserExist("Alice");
            setUserExists(exists !== null); // Explicitly check if the user object is not null
        }
        checkUser();
    }, []);

    useEffect(() => {
        if (userExists === false) {
            populate();
        }
    }, [userExists]);

    if (userExists === null) {
        return <div>Loading...</div>; // Or a more elaborate loading state
    }
  return (
    <div className="space-y-6">
      {/* Formulario para crear un nuevo VoxAgora */}
      <div className="bg-white p-6 rounded-lg shadow-md">
<h2 className="text-2xl font-bold mb-4 text-[#008080]">Crear un nuevo VoxAgora</h2>
        <form onSubmit={handleSubmitPost} className="space-y-4">
          <div>
            <label htmlFor="postTitle" className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              id="postTitle"
              className="mt-1 block w-full border border-[#B8860B] rounded-md shadow-sm p-2 focus:ring-[#B8860B] focus:border-[#B8860B]"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="¿Qué estás pensando?"
              required
            />
          </div>
          <div>
            <label htmlFor="postContent" className="block text-sm font-medium text-gray-700">Contenido (opcional)</label>
            <textarea
              id="postContent"
              rows={3}
              className="mt-1 block w-full border border-[#B8860B] rounded-md shadow-sm p-2 focus:ring-[#B8860B] focus:border-[#B8860B]"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Detalles adicionales..."
            ></textarea>
          </div>
          <div>
            <label htmlFor="authorSelect" className="block text-sm font-medium text-gray-700">Autor</label>
            <select
              id="authorSelect"
              className="mt-1 block w-full border border-[#B8860B] rounded-md shadow-sm p-2 focus:ring-[#B8860B] focus:border-[#B8860B]"
              value={selectedAuthorId}
              onChange={handleAuthorChange}
              required
            >
              <option value="">Selecciona un autor</option>
              {isLoadingAuthors && <option>Cargando autores...</option>}
              {isErrorAuthors && <option>Error al cargar autores: {errorAuthors?.message}</option>}
              {authors?.map((author) => (
                <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="publishedCheckbox"
              checked={newPostPublished}
              onChange={(e) => setNewPostPublished(e.target.checked)}
              className="h-4 w-4 text-[#008080] focus:ring-[#B8860B] border-[#B8860B] rounded"
            />
            <label htmlFor="publishedCheckbox" className="ml-2 block text-sm text-gray-900">
              Publicar inmediatamente
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-[#008080] text-white py-2 px-4 rounded-md hover:bg-[#006666] focus:outline-none focus:ring-2 focus:ring-[#B8860B] focus:ring-offset-2 border-b-2 border-[#B8860B]"
            disabled={createPostMutation.status === 'pending' || isLoadingAuthors || isErrorAuthors}
          >
            {createPostMutation.status === 'pending' ? "Publicando..." : "Publicar VoxAgora"}
          </button>
          {createPostMutation.isError && (
            <p className="text-red-500 text-sm mt-2">Error al publicar: {createPostMutation.error.message}</p>
          )}
        </form>
      </div>

      {/* Filtro de VoxAgoras por autor */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-[#008080]">Filtrar VoxAgoras</h2>
        <div>
          <label htmlFor="filterAuthorSelect" className="block text-sm font-medium text-gray-700">Filtrar por Autor</label>
          <select
            id="filterAuthorSelect"
            className="mt-1 block w-full border border-[#B8860B] rounded-md shadow-sm p-2 focus:ring-[#B8860B] focus:border-[#B8860B]"
            value={filterAuthorId === null ? "" : filterAuthorId}
            onChange={handleFilterAuthorChange}
          >
            <option value="">Mostrar todos los autores</option>
            {isLoadingAuthors && <option>Cargando autores...</option>}
            {isErrorAuthors && <option>Error al cargar autores: {errorAuthors?.message}</option>}
            {authors?.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de VoxAgoras */}
      <h2 className="text-2xl font-bold text-[#008080]">Últimos VoxAgoras</h2>
      {isLoading && <p className="text-center text-gray-600">Cargando VoxAgoras...</p>}
      {isError && <p className="text-center text-red-500">Error al cargar VoxAgoras: {error?.message}</p>}

      <div className="space-y-4">
        {posts?.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow-md border border-[#B8860B]">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-[#B2D8D8] rounded-full flex items-center justify-center text-[#004D4D] font-semibold text-sm mr-3">
                {post.author?.name ? post.author.name.charAt(0).toUpperCase() : "U"}
              </div>
              <p className="font-semibold text-gray-900">{post.author?.name || "Usuario Desconocido"}</p>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{post.title}</h3>
            {post.content && <p className="text-gray-700">{post.content}</p>}
            <p className="text-xs text-gray-500 mt-2">ID del Post: {post.id}</p>
          </div>
        ))}
        {posts?.length === 0 && !isLoading && !isError && (
          <p className="text-center text-gray-600">No hay VoxAgoras para mostrar. ¡Sé el primero en publicar!</p>
        )}
      </div>
    </div>
  );
}
