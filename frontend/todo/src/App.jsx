import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [filterUser, setFilterUser] = useState();
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "", age: "", city: "" });

  const getAllUsers = async () => {
    await axios.get("http://localhost:5000/users").then((res) => {
      setUsers(res.data);
      setFilterUser(res.data);
    });
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText) ||
        user.city.toLowerCase().includes(searchText)
    );
    setFilterUser(filteredUsers);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (isConfirmed) {
      await axios.delete(`http://localhost:5000/users/${id}`).then((res) => {
        setUsers(res.data);
        setFilterUser(res.data);
      });
    }
  };

  const handleAddRecord = () => {
    setUserData({ name: "", age: "", city: "" });
    setIsModelOpen(true);
  };
  
  const closeModel = () => {
    setIsModelOpen(false);
    getAllUsers();
  };

  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.id) {
      await axios
        .patch(`http://localhost:5000/users/${userData.id}`, userData)
        .then((res) => {
          console.log(res);
        });
    } else {
      await axios.post("http://localhost:5000/users", userData).then((res) => {
        console.log(res);
      });
    }
    closeModel();
    setUserData({ name: "", age: "", city: "" });
  };

  const handleUpdate = (user) => {
    setUserData(user);
    setIsModelOpen(true);
  };

  return (
    <>
      <div className="container">
        <h3>TODO-LIST</h3>
        <div className="input-search">
          <input
            type="search"
            placeholder="Search Something Here"
            onChange={handleSearchChange}
          />
          <button className="btn green" onClick={handleAddRecord}>
            Add Record
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filterUser &&
              filterUser.map((user, idx) => {
                return (
                  <tr key={user.id}>
                    <td>{idx + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.age}</td>
                    <td>{user.city}</td>
                    <td>
                      <button
                        onClick={() => handleUpdate(user)}
                        className="btn green"
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="btn red"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {isModelOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModel}>
                &times;
              </span>
              <h2>{userData.id ? "Update Record" : "User Record"}</h2>
              <div className="input-group">
                <label htmlFor="name">FullName</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={userData.name}
                  onChange={handleData}
                />
              </div>
              <div className="input-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  name="age"
                  id="age"
                  value={userData.age}
                  onChange={handleData}
                />
              </div>
              <div className="input-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={userData.city}
                  onChange={handleData}
                />
              </div>
              <button className="btn green" onClick={handleSubmit}>
                {userData.id ? "Update User" : "Add User"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default App;
