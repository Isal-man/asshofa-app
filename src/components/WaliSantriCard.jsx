export const WaliSantriCard = ({ gambar, namaLengkap }) => {
    return(
        <>
            <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-blue-700">WALI SANTRI</h3>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src={gambar}
                  alt={namaLengkap}
                  className="w-28 h-28 object-cover rounded-full border-4 border-blue-500 shadow-md"
                />
                <h4 className="mt-4 text-lg font-semibold text-gray-800">
                  {namaLengkap}
                </h4>
              </div>
        </>
    )
}