import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";

function App() {
  const [pincode, setPincode] = useState("");
  const [searchedPincode, setSearchedPincode] = useState("");
  const [postOffices, setPostOffices] = useState([]);
  const [filteredOffices, setFilteredOffices] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");

  const handlePincodeChange = (e) => {
    setPincode(e.target.value);
  };

  const handleFilterChange = (e) => {
    const query = e.target.value.toLowerCase();
    setFilterQuery(query);
    const filtered = postOffices.filter((office) =>
      office.Name.toLowerCase().includes(query)
    );
    setFilteredOffices(filtered);
  };
  const fetchPincodeData = async () => {
    if (pincode.length !== 6) {
      setError("Please enter a 6-digit pincode.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    setLoading(true);
    setError("");
    setPostOffices([]);
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = response.data[0];
      console.log(data);
      if (data.Status === "Error") {
        setError("Invalid Pincode");
        setTimeout(() => {
          setError("");
        }, 2000);
      } else {
        setPostOffices(data.PostOffice);
        setFilteredOffices(data.PostOffice);
        setSearchedPincode(pincode);
      }
    } catch (err) {
      setError("Error fetching data. Please try again.", err);
    } finally {
      setLoading(false);
      setPincode("");
    }
  };
  return (
    <div>
      <div className="container">
        <h1>Indian Post Office</h1>
        <div className="post-input">
          <div className="search-input">
            <div className="search-label">Enter Pincode:</div>
            <input
              type="text"
              className="input-field"
              value={pincode}
              onChange={handlePincodeChange}
            />
            <button type="submit" className="btn" onClick={fetchPincodeData}>
              Search
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
          <div className="filter-input">
            <div className="filter">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="input-field"
                placeholder="Filter"
                onChange={handleFilterChange}
                value={filterQuery}
              />
            </div>
          </div>
        </div>
        {loading && (
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#4fa94d"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
          />
        )}
         {!loading && postOffices.length > 0 && (
          <div className="search-info">
            <h3>Pincode: {searchedPincode}</h3>
            <p>Message: Number of pincode(s) found: {filteredOffices.length}</p>
          </div>
        )}

        {!loading && filteredOffices.length > 0 && (
          <div className="postal-list">
            {filteredOffices.map((office, index) => (
              <div key={index} className="postal-card">
                
                <div className="postal-card-body">
                  <h3>{office.Name}</h3>
                  <p>
                    <strong>BranchType:</strong> {office.BranchType}
                  </p>
                  <p>
                    <strong>DeliveryStatus:</strong>{office.DeliveryStatus}
                  </p>
                  <p>
                    <strong>District:</strong> {office.District}
                  </p>
                  <p>
                    <strong>Division:</strong> {office.Division}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
