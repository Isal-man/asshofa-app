import { useEffect, useState } from "react";
import { Sidebar } from "../components";
import {
  Card,
  CardContent,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { apiService } from "../services";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28BD4",
  "#D474A2",
];

const CustomTooltipJumlah = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-black p-2 rounded shadow-md">
        <p className="font-semibold">{payload[0].payload.name}</p>
        <p>Jumlah: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const CustomTooltipNilai = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-black p-2 rounded shadow-md">
        <p className="font-semibold">{payload[0].payload.name}</p>
        <p>Nilai Rata-rata: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.get("dashboard-view");
        if (response.status === 200) {
          setDashboardData(response.data.data);
        } else {
          setError(true);
        }
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress size={80} />
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div
        className={`container ml-30 p-6`}
      >
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

        {/* Notifikasi Error */}
        <Snackbar
          open={error}
          autoHideDuration={6000}
          onClose={() => setError(false)}
        >
          <Alert
            onClose={() => setError(false)}
            severity="error"
            sx={{ width: "100%" }}
          >
            Failed to fetch dashboard data
          </Alert>
        </Snackbar>

        {/* Kartu Statistik */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { title: "Total Santri", value: dashboardData?.totalSantri },
            { title: "Total Pengajar", value: dashboardData?.totalPengajar },
            {
              title: "Total Wali Santri",
              value: dashboardData?.totalWaliSantri,
            },
            {
              title: "Total Mata Pelajaran",
              value: dashboardData?.totalMataPelajaran,
            },
          ].map((item, index) => (
            <Card key={index} className="shadow-lg">
              <CardContent>
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-3xl">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pie Chart - Distribusi Santri Berdasarkan Gender */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">
            Distribusi Santri Berdasarkan Gender
          </h2>
          {dashboardData?.jumlahSantriPojo ? (
            <PieChart width={400} height={300}>
              <Pie
                data={Object.entries(dashboardData.jumlahSantriPojo).map(
                  ([key, value]) => ({
                    name: key,
                    value,
                  })
                )}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {COLORS.slice(0, 2).map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          ) : (
            <CircularProgress />
          )}
        </div>

        {/* Bar Chart - Jumlah Santri Per Kelas */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">
            Jumlah Santri Per Kelas
          </h2>
          {dashboardData?.jumlahSantriPerKelas ? (
            <BarChart
              width={600}
              height={300}
              data={dashboardData.jumlahSantriPerKelas.map((item, index) => ({
                name: Object.keys(item)[0],
                value: Object.values(item)[0],
                color: COLORS[index % COLORS.length],
              }))}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltipJumlah />} />
              <Legend />
              <Bar dataKey="value" name={"Nama Kelas"}>
                {dashboardData.jumlahSantriPerKelas.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>

          ) : (
            <CircularProgress />
          )}
        </div>

        {/* Bar Chart - Nilai Rata-Rata Per Kelas */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">
            Nilai Rata-rata Per Kelas
          </h2>
          {dashboardData?.nilaiAveragePerKelas ? (
            <BarChart
              width={600}
              height={300}
              data={dashboardData.nilaiAveragePerKelas.map((item, index) => ({
                name: Object.keys(item)[0],
                value: Object.values(item)[0],
                color: COLORS[index % COLORS.length],
              }))}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltipNilai />} />
              <Legend />
              <Bar dataKey="value" name={"Nama Kelas"}>
                {dashboardData.nilaiAveragePerKelas.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <CircularProgress />
          )}
        </div>

        {/* List - Santri Terbaru */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Santri Terbaru</h2>
          {dashboardData?.santriTerbaruList ? (
            <ul>
              {dashboardData.santriTerbaruList.map((santri) => (
                <li key={santri.id} className="border-b py-2">
                  {santri.namaLengkap} -{" "}
                  {new Date(santri.createdAt).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <CircularProgress />
          )}
        </div>
      </div>
    </div>
  );
};
