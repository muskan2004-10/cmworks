import { useState, useEffect } from "react";
import axios from "axios";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import "./pages.css";

export default function ProjectImage() {

  const navigate = useNavigate();
  const location = useLocation();

  // =====================================================
  // DATA FROM DASHBOARD
  // =====================================================

  const dashboardProject =
    location.state?.projectId || "";

  const dashboardProjectName =
    location.state?.projectName || "";

  // =====================================================
  // STATES
  // =====================================================

  const [form, setForm] = useState({
    PRJ_NAME: "",
    PRJIMGDT: "",
    IMGTITLE: "",
  });

  const [images, setImages] =
    useState([]);

  const [preview, setPreview] =
    useState([]);

  const [doc, setDoc] =
    useState(null);

  const [showSuccess, setShowSuccess] =
    useState(false);

  // =====================================================
  // VALIDATION ERRORS
  // =====================================================

  const [errors, setErrors] =
    useState({});

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    setForm((prev) => ({
      ...prev,

      PRJ_NAME:
        dashboardProject,

      PRJIMGDT:
        new Date()
          .toISOString()
          .split("T")[0],
    }));

  }, [dashboardProject]);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    // REMOVE ERROR
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

 // =====================================================
// IMAGE UPLOAD
// =====================================================

const handleImages = (e) => {

  const files = Array.from(e.target.files);

  if (files.length === 0) {
    return;
  }

  // ==========================================
  // MERGE OLD + NEW IMAGES
  // ==========================================

  const updatedImages = [
    ...images,
    ...files,
  ];

  // MAX 10 IMAGES
  if (updatedImages.length > 10) {

    setErrors((prev) => ({
      ...prev,
      images:
        "Maximum 10 images allowed",
    }));

    return;
  }

  // FILE TYPE VALIDATION
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  for (let file of files) {

    if (
      !allowedTypes.includes(file.type)
    ) {

      setErrors((prev) => ({
        ...prev,
        images:
          "Only JPG, PNG and WEBP images allowed",
      }));

      return;
    }

    // 5MB LIMIT
    if (
      file.size >
      5 * 1024 * 1024
    ) {

      setErrors((prev) => ({
        ...prev,
        images:
          "Each image must be less than 5MB",
      }));

      return;
    }
  }

  // CLEAR ERROR
  setErrors((prev) => ({
    ...prev,
    images: "",
  }));

  // SAVE OLD + NEW IMAGES
  setImages(updatedImages);

  // CREATE PREVIEW URLS
  const newPreviewUrls = files.map((file) =>
    URL.createObjectURL(file)
  );

  // ADD TO OLD PREVIEWS
  setPreview((prev) => [
    ...prev,
    ...newPreviewUrls,
  ]);

  // RESET INPUT VALUE
  e.target.value = "";
};

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  const removeImage = (index) => {

    const newImages =
      [...images];

    const newPreview =
      [...preview];

    newImages.splice(index, 1);

    newPreview.splice(index, 1);

    setImages(newImages);

    setPreview(newPreview);
  };

  // =====================================================
  // DOCUMENT
  // =====================================================

  const handleDoc = (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    // ALLOWED DOC TYPES
    const allowedDocs = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (
      !allowedDocs.includes(
        file.type
      )
    ) {

      setErrors((prev) => ({
        ...prev,
        document:
          "Only PDF and DOC files allowed",
      }));

      return;
    }

    // 10MB LIMIT
    if (
      file.size >
      10 * 1024 * 1024
    ) {

      setErrors((prev) => ({
        ...prev,
        document:
          "Document must be less than 10MB",
      }));

      return;
    }

    setErrors((prev) => ({
      ...prev,
      document: "",
    }));

    setDoc(file);
  };

  // =====================================================
  // FORM VALIDATION
  // =====================================================

  const validateForm = () => {

    let newErrors = {};

    // PROJECT
    if (!form.PRJ_NAME) {

      newErrors.PRJ_NAME =
        "Project is required";
    }

    // DATE
    if (!form.PRJIMGDT) {

      newErrors.PRJIMGDT =
        "Date is required";
    }

    // TITLE
    if (
      !form.IMGTITLE.trim()
    ) {

      newErrors.IMGTITLE =
        "Title is required";
    }

    // TITLE LENGTH
    else if (
      form.IMGTITLE.length < 3
    ) {

      newErrors.IMGTITLE =
        "Title must be at least 3 characters";
    }

    // IMAGES
    if (
      images.length === 0
    ) {

      newErrors.images =
        "Please upload at least one image";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    // VALIDATE
    if (!validateForm()) {
      return;
    }

    const fd =
      new FormData();

    fd.append(
      "PRJ_NAME",
      form.PRJ_NAME
    );

    fd.append(
      "PRJIMGDT",
      form.PRJIMGDT
    );

    fd.append(
      "IMGTITLE",
      form.IMGTITLE
    );

    images.forEach((img) => {

      fd.append(
        "images",
        img
      );
    });

    if (doc) {

      fd.append(
        "document",
        doc
      );
    }

    try {

      await axios.post(
        "http://localhost:5000/api/project-image/upload",
        fd
      );

      setShowSuccess(true);

      // RESET FORM
      setForm({
        PRJ_NAME:
          dashboardProject,

        PRJIMGDT:
          new Date()
            .toISOString()
            .split("T")[0],

        IMGTITLE: "",
      });

      setImages([]);

      setPreview([]);

      setDoc(null);

      setErrors({});

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          "Upload Failed"
      );
    }
  };

  // =====================================================
  // RETURN
  // =====================================================

  const goDashboard = () => {

    navigate(
      "/project-onboarding/dashboard"
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="page-container">

      {/* HEADER */}

      <div className="page-header">
        Project Image
      </div>

      {/* FORM */}

      <form
        className="page-form"
        onSubmit={handleSubmit}
      >

        <div className="form-grid">

          {/* PROJECT */}

          <div className="form-group">

            <label>
              Project *
            </label>

            <input
              type="text"
              value={
                dashboardProjectName
              }
              readOnly
            />

            {errors.PRJ_NAME && (
              <small className="error">
                {errors.PRJ_NAME}
              </small>
            )}

          </div>

          {/* DATE */}

          <div className="form-group">

            <label>
              Date *
            </label>

            <input
              type="date"
              name="PRJIMGDT"
              value={
                form.PRJIMGDT
              }
              onChange={
                handleChange
              }
            />

            {errors.PRJIMGDT && (
              <small className="error">
                {errors.PRJIMGDT}
              </small>
            )}

          </div>

          {/* TITLE */}

          <div className="form-group full-width">

            <label>
              Title *
            </label>

            <input
              type="text"
              name="IMGTITLE"
              value={
                form.IMGTITLE
              }
              onChange={
                handleChange
              }
            />

            {errors.IMGTITLE && (
              <small className="error">
                {errors.IMGTITLE}
              </small>
            )}

          </div>

          {/* IMAGE */}

          <div className="form-group full-width">

            <label>
              Upload Images *
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={
                handleImages
              }
            />

            {errors.images && (
              <small className="error">
                {errors.images}
              </small>
            )}

          </div>

          {/* PREVIEW */}

          {preview.length > 0 && (

            <div className="form-group full-width">

              <label>
                Preview
              </label>

              <div className="preview">

                {preview.map(
                  (img, i) => (

                    <div
                      key={i}
                      className="preview-item"
                    >

                      <img
                        src={img}
                        alt=""
                        className="preview-img"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(i)
                        }
                      >
                        ×
                      </button>

                    </div>
                  )
                )}

              </div>

            </div>
          )}

          {/* DOCUMENT */}

          <div className="form-group full-width">

            <label>
              Document
            </label>

            <input
              type="file"
              onChange={
                handleDoc
              }
            />

            {errors.document && (
              <small className="error">
                {errors.document}
              </small>
            )}

          </div>

        </div>

        {/* BUTTONS */}

        <div className="form-actions">

          <button
            type="button"
            className="btn cancel"
            onClick={
              goDashboard
            }
          >
            Return
          </button>

          <button
            type="submit"
            className="btn save"
          >
            Save
          </button>

        </div>

      </form>

      {/* SUCCESS POPUP */}

      {showSuccess && (

        <div className="popup-overlay">

          <div className="popup-box">

            <h3>
              Success
            </h3>

            <p>
              Project Image saved successfully.
            </p>

            <button
              className="btn save"
              onClick={
                goDashboard
              }
            >
              OK
            </button>

          </div>

        </div>
      )}

    </div>
  );
}