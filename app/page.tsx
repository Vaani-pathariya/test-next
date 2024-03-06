"use client";
import { useEffect, useState } from "react";

export default function Home() {
  interface User {
    _id: number;
    name: string;
    phoneNo: number;
    email: string;
    hobbies: string;
  }

  const [data, setData] = useState<User[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phoneNo: "",
    email: "",
    hobbies: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/mongo");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = (await response.json()) as User[];
      setData(jsonData);
      console.log(jsonData);
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
    }
  };

  const toggleRowSelection = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };
  console.log(selectedRows);
  const handleAddDataClick = () => {
    setShowForm(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const final = await fetch("/api/mongo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send formData as JSON string
      });

      if (final.ok) {
        console.log(final);
      } else {
        throw new Error("Failed to save data");
      }

      // Reset form data
      setFormData({
        name: "",
        phoneNo: "",
        email: "",
        hobbies: "",
      });

      // Close the form
      setShowForm(false);

      // Refetch data to update the table
      fetchData();
    } catch (error: any) {
      console.error("Error saving data:", error.message);
    }
  };
  const sendSelectedRowsToEmail = async () => {
    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedRows }),
      });

      if (response.ok) {
        console.log("Selected rows sent to email successfully");
      } else {
        throw new Error("Failed to send selected rows to email");
      }
    } catch (error: any) {
      console.error("Error sending selected rows to email:", error.message);
    }
  };

  return (
    <main className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Data Table</h1>
      <div className="flex justify-center mb-4">
        <button
          className="mr-4 px-4 py-2 border border-gray-200"
          onClick={handleAddDataClick}
        >
          Add new Data
        </button>
        <button
          className="px-4 py-2 border border-gray-200"
          onClick={sendSelectedRowsToEmail}
        >
          Send Data to email
        </button>
      </div>
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-gray-200">Select rows</th>
            <th className="px-4 py-2 border border-gray-200">ID</th>
            <th className="px-4 py-2 border border-gray-200">Name</th>
            <th className="px-4 py-2 border border-gray-200">Phone Number</th>
            <th className="px-4 py-2 border border-gray-200">Email</th>
            <th className="px-4 py-2 border border-gray-200">Hobbies</th>
            <th className="px-4 py-2 border border-gray-200">Update/delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border border-gray-200">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(item._id)}
                  onChange={() => toggleRowSelection(item._id)}
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
              </td>
              <td className="px-4 py-2 border border-gray-200">{item._id}</td>
              <td className="px-4 py-2 border border-gray-200">{item.name}</td>
              <td className="px-4 py-2 border border-gray-200">
                {item.phoneNo}
              </td>
              <td className="px-4 py-2 border border-gray-200">{item.email}</td>
              <td className="px-4 py-2 border border-gray-200">
                {item.hobbies}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-md relative">
            <button onClick={() => setShowForm(false)}>Close</button>
            <br></br>
            <form>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <br></br>
              <label>Phone Number:</label>
              <input
                type="number"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
              />
              <br></br>
              <label>Email:</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <br></br>
              <label>Hobbies:</label>
              <input
                type="text"
                name="hobbies"
                value={formData.hobbies}
                onChange={handleChange}
              />
              <br></br>
            </form>
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      )}
    </main>
  );
}
