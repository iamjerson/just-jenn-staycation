"use client";

import { useState, useEffect, useCallback } from "react";

interface Photo {
  id: number;
  url: string;
  caption: string | null;
  albumId: number;
  createdAt: string;
}

interface Album {
  id: number;
  name: string;
  description: string | null;
  coverImage: string | null;
  photos: Photo[];
  createdAt: string;
}

export default function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddAlbum, setShowAddAlbum] = useState(false);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [newAlbum, setNewAlbum] = useState({ name: "", description: "" });
  const [newPhoto, setNewPhoto] = useState({ url: "", caption: "" });
  const [adminPassword, setAdminPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const fetchAlbums = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery/albums");
      const data = await res.json();
      setAlbums(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const handleAdminLogin = () => {
    if (adminPassword === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || adminPassword === "justjenn2026") {
      setIsAdmin(true);
      setShowLogin(false);
      setAdminPassword("");
    }
  };

  const handleCreateAlbum = async () => {
    if (!newAlbum.name.trim()) return;
    try {
      await fetch("/api/gallery/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAlbum),
      });
      setNewAlbum({ name: "", description: "" });
      setShowAddAlbum(false);
      fetchAlbums();
    } catch {}
  };

  const handleDeleteAlbum = async (id: number) => {
    if (!confirm("Delete this album and all its photos?")) return;
    try {
      await fetch(`/api/gallery/albums/${id}`, { method: "DELETE" });
      setSelectedAlbum(null);
      fetchAlbums();
    } catch {}
  };

  const handleAddPhoto = async () => {
    if (!newPhoto.url.trim() || !selectedAlbum) return;
    try {
      await fetch("/api/gallery/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: newPhoto.url,
          caption: newPhoto.caption,
          albumId: selectedAlbum.id,
        }),
      });
      setNewPhoto({ url: "", caption: "" });
      setShowAddPhoto(false);
      fetchAlbums();
    } catch {}
  };

  const handleDeletePhoto = async (id: number) => {
    if (!confirm("Delete this photo?")) return;
    try {
      await fetch(`/api/gallery/photos/${id}`, { method: "DELETE" });
      setSelectedPhoto(null);
      fetchAlbums();
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-blue-800 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Gallery
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Take a peek at our beautiful space and amenities
          </p>
        </div>

        {!isAdmin && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowLogin(true)}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Admin Login
            </button>
          </div>
        )}

        {showLogin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
              <h3 className="text-lg font-bold mb-4">Admin Login</h3>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLogin(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-xl text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdminLogin}
                  className="flex-1 px-4 py-2 bg-blue-800 text-white rounded-xl"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="flex justify-end gap-3 mb-8">
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Admin Mode
            </span>
            <button
              onClick={() => setIsAdmin(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        )}

        {!selectedAlbum ? (
          <>
            {isAdmin && (
              <div className="mb-8">
                <button
                  onClick={() => setShowAddAlbum(true)}
                  className="bg-blue-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-900 transition"
                >
                  + Create Album
                </button>
              </div>
            )}

            {showAddAlbum && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 max-w-lg">
                <h3 className="text-lg font-bold mb-4">New Album</h3>
                <input
                  type="text"
                  value={newAlbum.name}
                  onChange={(e) => setNewAlbum({ ...newAlbum, name: e.target.value })}
                  placeholder="Album name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={newAlbum.description}
                  onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
                  placeholder="Description (optional)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddAlbum(false)}
                    className="px-4 py-2 bg-gray-100 rounded-xl text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAlbum}
                    className="px-4 py-2 bg-blue-800 text-white rounded-xl"
                  >
                    Create
                  </button>
                </div>
              </div>
            )}

            {albums.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>No albums yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => setSelectedAlbum(album)}
                  >
                    <div className="aspect-[4/3] bg-blue-50 flex items-center justify-center overflow-hidden">
                      {album.coverImage || album.photos[0] ? (
                        <img
                          src={album.coverImage || album.photos[0].url}
                          alt={album.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <svg className="w-16 h-16 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900">{album.name}</h3>
                      {album.description && (
                        <p className="text-sm text-gray-500 mt-1">{album.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {album.photos.length} photo{album.photos.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <button
                  onClick={() => setSelectedAlbum(null)}
                  className="text-blue-800 font-medium flex items-center gap-1 mb-2 hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Albums
                </button>
                <h2 className="text-2xl font-bold text-gray-900">{selectedAlbum.name}</h2>
                {selectedAlbum.description && (
                  <p className="text-gray-500">{selectedAlbum.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                {isAdmin && (
                  <>
                    <button
                      onClick={() => setShowAddPhoto(true)}
                      className="bg-blue-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-900 transition"
                    >
                      + Add Photo
                    </button>
                    <button
                      onClick={() => handleDeleteAlbum(selectedAlbum.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-700 transition"
                    >
                      Delete Album
                    </button>
                  </>
                )}
              </div>
            </div>

            {showAddPhoto && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 max-w-lg">
                <h3 className="text-lg font-bold mb-4">Add Photo</h3>
                <input
                  type="text"
                  value={newPhoto.url}
                  onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                  placeholder="Image URL"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={newPhoto.caption}
                  onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                  placeholder="Caption (optional)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddPhoto(false)}
                    className="px-4 py-2 bg-gray-100 rounded-xl text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddPhoto}
                    className="px-4 py-2 bg-blue-800 text-white rounded-xl"
                  >
                    Add Photo
                  </button>
                </div>
              </div>
            )}

            {selectedAlbum.photos.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <p>No photos in this album yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedAlbum.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer group relative"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || "Photo"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {photo.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <p className="text-white text-sm">{photo.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || "Photo"}
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />
              {selectedPhoto.caption && (
                <p className="text-white text-center mt-4">{selectedPhoto.caption}</p>
              )}
              {isAdmin && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => handleDeletePhoto(selectedPhoto.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-700"
                  >
                    Delete Photo
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
