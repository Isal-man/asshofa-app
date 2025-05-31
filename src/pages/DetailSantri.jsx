import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import { Sidebar, WaliSantriCard } from "../components";

const formatTanggal = (tanggal) => {
  const tanggalObj = new Date(tanggal);
  return tanggalObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const DetailSantri = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [santri, setSantri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSantri = async () => {
      try {
        const res = await apiService.get(`/santri/${id}`);
        setSantri(res.data.data);
      } catch (err) {
        setError("Gagal memuat data santri");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSantri();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !santri) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="flex text-white">
      <Sidebar />
      <div className="container ml-30 p-6">
        <div className="flex flex-col justify-center w-full p-6">
          <h1 className="text-3xl font-bold mb-4">Detail Santri</h1>
          <div className="max-w-4xl w-full">
            <div className="mb-6">
              <button
                onClick={() => navigate(-1)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow-md transition duration-300"
              >
                ← Kembali
              </button>
            </div>

            <div className="bg-white text-gray-800 rounded-2xl shadow-xl p-10 w-full">
              <div className="flex flex-col items-center mb-8">
                <img
                  src={santri.gambar}
                  alt={santri.namaLengkap}
                  className="w-40 h-40 object-cover rounded-full border-4 border-blue-500 shadow-lg"
                />
                <h2 className="mt-4 text-3xl font-bold text-blue-700">
                  {santri.namaLengkap}
                </h2>
              </div>
              <div className="space-y-4 text-base">
                <div className="flex">
                  <span className="w-40 font-medium text-gray-500">
                    Tempat Lahir
                  </span>
                  <span className="font-semibold text-gray-800">
                    : {santri.tempatLahir}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-40 font-medium text-gray-500">
                    Tanggal Lahir
                  </span>
                  <span className="font-semibold text-gray-800">
                    : {formatTanggal(santri.tanggalLahir)}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-40 font-medium text-gray-500">
                    Jenis Kelamin
                  </span>
                  <span className="font-semibold text-gray-800">
                    : {santri.jenisKelamin}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="w-40 font-medium text-gray-500">Alamat</span>
                  <span className="font-semibold text-gray-800">
                    : {santri.alamat}
                  </span>
                </div>
              </div>
              <hr className="my-8 border-gray-300" />
              <WaliSantriCard gambar={santri.gambarWali} namaLengkap={santri.namaWali} status={"wali-santri"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
