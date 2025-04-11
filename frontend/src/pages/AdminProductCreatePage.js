// src/pages/AdminProductCreatePage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminProductCreatePage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const [category, setCategory] = useState('men');
  const baseURL = process.env.REACT_APP_API_URL;
  const [files, setFiles] = useState([]);
  const [sizesInput, setSizesInput] = useState('');
  const [colorsInput, setColorsInput] = useState('');
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(newFiles);
  };

  const uploadToCloudinary = async (file) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = 'products';

    try {
      const signRes = await fetch(`${baseURL}/uploads/sign?timestamp=${timestamp}&folder=${folder}`);
      const { signature, apiKey, cloudName } = await signRes.json();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', folder);

      const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await cloudinaryRes.json();

      if (data.secure_url) {
        return data.secure_url;
      } else {
        console.error('Cloudinary error:', data);
        return null;
      }
    } catch (err) {
      console.error('Error al subir a Cloudinary:', err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Subir imágenes primero
      const imageUrls = await Promise.all(files.map(uploadToCloudinary));
      const filteredImageUrls = imageUrls.filter(url => url !== null);

      if (filteredImageUrls.length === 0) {
        alert('Error al subir imágenes. Intenta de nuevo.');
        return;
      }

      // ✅ Preparar el cuerpo del producto
      const productData = {
        name,
        description,
        price,
        countInStock,
        category,
        availableSizes: sizesInput.split(',').map(s => s.trim()).filter(Boolean),
        availableColors: colorsInput.split(',').map(c => c.trim()).filter(Boolean),
        images: filteredImageUrls,
      };

      const res = await fetch(`${baseURL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (res.ok) {
        navigate('/admin/productlist');
      } else {
        alert(data.message || 'Error al crear el producto');
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      alert('Error al crear el producto. Revisa la consola.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Crear Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold">Nombre</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded p-2 mt-1" required />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Descripción</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded p-2 mt-1" required />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Precio</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border rounded p-2 mt-1" required />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Stock</label>
          <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} className="w-full border rounded p-2 mt-1" required />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Subir Imágenes</label>
          <input type="file" name="images" multiple onChange={handleFileChange} className="w-full border rounded p-2 mt-1" required />
          {files.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-sm">
              {files.map((file, i) => <li key={i}>{file.name}</li>)}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Categoría</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded p-2 mt-1" required>
            <option value="men">Hombres</option>
            <option value="women">Mujeres</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Tallas Disponibles (separadas por comas)</label>
          <input type="text" value={sizesInput} onChange={(e) => setSizesInput(e.target.value)} className="w-full border rounded p-2 mt-1" placeholder="Ej.: 38, 39, 40" />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Colores Disponibles (separados por comas)</label>
          <input type="text" value={colorsInput} onChange={(e) => setColorsInput(e.target.value)} className="w-full border rounded p-2 mt-1" placeholder="Ej.: negro, blanco, rojo" />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Crear Producto
        </button>
      </form>
    </div>
  );
};

export default AdminProductCreatePage;
