import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import api from "../utils/api";

function UploadNote() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [file, setFile] =
    useState(null);

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      subject: "",
      semester: "",
      branch: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (!file) {
        return alert(
          "Please select a file"
        );
      }

      try {
        setLoading(true);

        const data =
          new FormData();

        Object.keys(formData).forEach(
          (key) => {
            data.append(
              key,
              formData[key]
            );
          }
        );

        data.append("file", file);

        await api.post(
          "/notes",
          data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        alert(
          "Note uploaded successfully"
        );

        navigate("/notes");
      } catch (error) {
        console.log(error);

        alert(
          error.response?.data
            ?.message ||
            "Upload failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold text-white mb-8">
          Upload Notes
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
          className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4"
        >

          <input
            name="title"
            value={
              formData.title
            }
            onChange={
              handleChange
            }
            placeholder="Title"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
          />

          <textarea
            name="description"
            value={
              formData.description
            }
            onChange={
              handleChange
            }
            placeholder="Description"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
          />

          <input
            name="subject"
            value={
              formData.subject
            }
            onChange={
              handleChange
            }
            placeholder="Subject"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
          />

          <input
            name="semester"
            value={
              formData.semester
            }
            onChange={
              handleChange
            }
            placeholder="Semester"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
          />

          <input
            name="branch"
            value={
              formData.branch
            }
            onChange={
              handleChange
            }
            placeholder="Branch"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
          />

          <input
            type="file"
            onChange={(e) =>
              setFile(
                e.target.files[0]
              )
            }
            className="text-white"
          />

          <button
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl text-white"
          >
            {loading
              ? "Uploading..."
              : "Upload Note"}
          </button>

        </form>

      </div>
    </MainLayout>
  );
}

export default UploadNote;