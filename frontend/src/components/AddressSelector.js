import { useState, useEffect } from "react";
import axios from "axios";

export default function LocationSelect() {
  const API_URL = "http://localhost:5000/api/location";
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [villages, setVillages] = useState([]);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/districts`).then(res => setDistricts(res.data));
  }, []);

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    setSelectedBlock("");
    setSelectedVillage("");
    axios.get(`${API_URL}/blocks?district=${district}`).then(res => setBlocks(res.data));
  };

  const handleBlockChange = (block) => {
    setSelectedBlock(block);
    setSelectedVillage("");
    axios.get(`${API_URL}/villages?district=${selectedDistrict}&block=${block}`).then(res => setVillages(res.data));
  };

  return (
    <div className="space-y-4">
      {/* District */}
      <select value={selectedDistrict} onChange={(e) => handleDistrictChange(e.target.value)} className="border p-2 rounded">
        <option value="">Select District</option>
        {districts.map((d, i) => <option key={i}>{d}</option>)}
      </select>

      {/* Block */}
      <select value={selectedBlock} onChange={(e) => handleBlockChange(e.target.value)} className="border p-2 rounded" disabled={!selectedDistrict}>
        <option value="">Select Block</option>
        {blocks.map((b, i) => <option key={i}>{b}</option>)}
      </select>

      {/* Village */}
      <select value={selectedVillage} onChange={(e) => setSelectedVillage(e.target.value)} className="border p-2 rounded" disabled={!selectedBlock}>
        <option value="">Select Village</option>
        {villages.map((v, i) => <option key={i}>{v}</option>)}
      </select>
    </div>
  );
}
