import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import "./SellProduct.css";
import { ShopContext } from "../../context/ShopContext";
import { FormContext } from "../../context/FormContext";
import { Link, useNavigate } from "react-router-dom";
import {
  AiOutlinePlusCircle,
  AiOutlineCamera,
  AiOutlineTag,
  AiOutlineDollar,
  AiOutlineFileText,
  AiOutlineColumnWidth,
} from "react-icons/ai";
import Swal from "sweetalert2";
import Axios from 'axios';

const CATEGORIES = [
  { value: "", label: "Sin categoría" },
  { value: "Tecnologia", label: "💻 Tecnología" },
  { value: "Ropa", label: "👗 Ropa" },
  { value: "Zapatos", label: "👠 Zapatos" },
  { value: "Accesorios", label: "💎 Oro y Joyas" },
  { value: "Perfumes", label: "🧴 Perfumes" },
  { value: "Juguetes", label: "🧸 Juguetes" },
  { value: "Otros", label: "📦 Otros" },
];

const CATEGORIES_WITH_SIZE = ["Ropa", "Zapatos", "Accesorios"];

const SellProduct = () => {
  const [formData, setFormData] = useState({
    titulo: "",
    new_price: "",
    tipo: "",
    talla: "",
    descripcion: "",
  });
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userlist } = useContext(FormContext);
  const { addProduct } = useContext(ShopContext);

  const currentUser = userlist && userlist.length > 0 ? userlist[0] : null;
  const isSeller = currentUser ? currentUser.tipo === 'vendedor' : false;
  const bankAccount = currentUser ? currentUser.cuenta_bancaria : '';

  const showSizeField = useMemo(() => {
    return CATEGORIES_WITH_SIZE.includes(formData.tipo);
  }, [formData.tipo]);

  const isFormValid = useMemo(() => {
    if (showSizeField && !formData.talla.trim()) {
      return false;
    }
    return formData.titulo.trim() && formData.new_price && imgFile;
  }, [formData.titulo, formData.new_price, imgFile, formData.talla, showSizeField]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      if (name === "tipo" && !CATEGORIES_WITH_SIZE.includes(value)) {
        newData.talla = "";
      }

      return newData;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (imgPreview) URL.revokeObjectURL(imgPreview);
    };
  }, [imgPreview]);
  const navigate = useNavigate();

  const handleImageChange = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        Swal.fire({
          icon: "error",
          title: "Tipo de archivo no válido",
          text: "Por favor, selecciona una imagen válida (JPEG, PNG, etc.)",
          confirmButtonColor: "#007bff",
        });
        return;
      }

      if (file.size > 30 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "Archivo demasiado grande",
          text: "La imagen no debe superar los 30MB",
          confirmButtonColor: "#007bff",
        });
        return;
      }

      if (imgPreview) URL.revokeObjectURL(imgPreview);

      setImgFile(file);
      setImgPreview(URL.createObjectURL(file));
    },
    [imgPreview]
  );

  const handleAddProduct = useCallback(async () => {
    if (!isSeller) {
      Swal.fire({
        icon: 'info',
        title: '¡Necesitas ser vendedor!',
        text: 'Para poder agregar productos, primero debes registrarte como vendedor en tu perfil.',
        confirmButtonColor: '#007bff',
      });
      return;
    }

    if (!isFormValid) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos requeridos",
        confirmButtonColor: "#007bff",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await Swal.fire({
        title: "¿Agregar producto?",
        text: "¿Estás seguro de que deseas agregar este producto (el admin debe aprobar el producto)?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#007bff",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sí, agregar",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) {
        setIsSubmitting(false);
        return;
      }

      const tallaToSend = showSizeField ? formData.talla : "0";

      const uploadPromises = userlist.map((user) => {
        const formDataToSend = new FormData();
        formDataToSend.append("titulo", formData.titulo);
        formDataToSend.append("new_price", formData.new_price);
        formDataToSend.append("old_price", "");
        formDataToSend.append("photo", imgFile);
        formDataToSend.append("id_user", user.id);
        formDataToSend.append("tipo", formData.tipo);
        formDataToSend.append("talla", tallaToSend);
        formDataToSend.append("descripcion", formData.descripcion);

        return addProduct(formDataToSend);
      });

      await Promise.all(uploadPromises);

      await Swal.fire({
        icon: "success",
        title: "¡Producto agregado!",
        text: "El producto se ha agregado exitosamente",
        confirmButtonColor: "#007bff",
      });

      setFormData({
        titulo: "",
        new_price: "",
        tipo: "",
        talla: "",
        descripcion: "",
      });
      setImgFile(null);
      setImgPreview(null);
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al agregar el producto",
        confirmButtonColor: "#007bff",
      });
      console.error("Error al agregar producto:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, imgFile, userlist, addProduct, isFormValid, showSizeField, isSeller]);

  const formattedPrice = useMemo(() => {
    if (!formData.new_price) return "$0.00";
    const price = parseFloat(formData.new_price);
    return isNaN(price) ? "$0.00" : `$${price.toFixed(2)}`;
  }, [formData.new_price]);

  const selectedCategory = useMemo(() => {
    return (
      CATEGORIES.find((c) => c.value === formData.tipo)?.label ||
      "Sin categoría"
    );
  }, [formData.tipo]);

  return (
    <div className="sell-product-container">
      <h2 className="sell-product-title">
        <AiOutlinePlusCircle className="title-icon" />
        <span>Agregar Producto</span>
      </h2>

      <div className="sell-product-layout">
        <div className="sell-product-form">
          <div className="input-group">
            <label htmlFor="titulo" className="input-label">
              <AiOutlineTag className="input-icon" />
              Título
            </label>
            <input
              id="titulo"
              className="sell-product-input"
              onChange={handleInputChange}
              type="text"
              name="titulo"
              placeholder="Ingresa un título descriptivo"
              value={formData.titulo}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="new_price" className="input-label">
              <AiOutlineDollar className="input-icon" />
              Precio
            </label>
            <input
              id="new_price"
              className="sell-product-input"
              onChange={handleInputChange}
              type="number"
              name="new_price"
              placeholder="Precio del producto"
              value={formData.new_price}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="tipo" className="input-label">
              Categoría
            </label>
            <select
              id="tipo"
              className="sell-product-input"
              onChange={handleInputChange}
              name="tipo"
              value={formData.tipo}
            >
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {showSizeField && (
            <div className="input-group size-field-animated">
              <label htmlFor="talla" className="input-label">
                <AiOutlineColumnWidth className="input-icon" />
                Talla
              </label>
              <input
                id="talla"
                className="sell-product-input"
                onChange={handleInputChange}
                type="text"
                name="talla"
                placeholder="Ej: S, M, L, XL, 8, 9, 10..."
                value={formData.talla}
              />
            </div>
          )}

          <div className="input-group">
            <label htmlFor="descripcion" className="input-label">
              <AiOutlineFileText className="input-icon" />
              Descripción del producto
            </label>
            <textarea
              id="descripcion"
              className="sell-product-textarea"
              onChange={handleInputChange}
              name="descripcion"
              placeholder=" Describe las características, estado, materiales y otros detalles importantes del producto..."
              value={formData.descripcion}
              rows="4"
            />
          </div>

          <div className="input-group">
            <label htmlFor="product-image" className="input-label">
              <AiOutlineCamera className="input-icon" />
              Imagen
            </label>
            <div className="file-input-container">
              <input
                className="file-input"
                onChange={handleImageChange}
                type="file"
                accept="image/*"
                id="product-image"
                required
              />
              <label htmlFor="product-image" className="file-input-label">
                {imgFile ? imgFile.name : "Seleccionar imagen"}
              </label>
            </div>
          </div>
        </div>

        <div className="sell-product-preview">
          {imgPreview ? (
            <div className="product-card">
              <div className="product-image-container">
                <img
                  src={imgPreview}
                  alt="Vista previa del producto"
                  className="product-image"
                />
              </div>
              <div className="product-info">
                <h3>{formData.titulo || "Título del producto"}</h3>
                <p className="product-price">{formattedPrice}</p>
                <p className="product-category">{selectedCategory}</p>
                {formData.talla && showSizeField && (
                  <p className="product-size">Talla: {formData.talla}</p>
                )}
                {formData.descripcion && (
                  <p className="product-description">
                    {formData.descripcion.length > 100
                      ? `${formData.descripcion.substring(0, 100)}...`
                      : formData.descripcion}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="preview-placeholder">
              <AiOutlineCamera size={48} />
              <p>Vista previa del producto</p>
              <span className="preview-hint">
                Sube una imagen para ver cómo se verá tu producto
              </span>
            </div>
          )}
        </div>
      </div>

      <button
        className={`sell-product-button ${!isFormValid || !isSeller ? "disabled" : ""}`}
        onClick={handleAddProduct}
        disabled={!isFormValid || isSubmitting || !isSeller}
      >
        {isSubmitting ? (
          <>Procesando...</>
        ) : (
          <>
            Agregar Producto <AiOutlinePlusCircle size={20} />
          </>
        )}
      </button>
    </div>
  );
};

export default SellProduct;