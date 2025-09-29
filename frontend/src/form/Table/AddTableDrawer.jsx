// AddTableDrawer.jsx
import React, { useState, useEffect } from "react";
import {
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CCol,
  CRow,
  CFormSwitch,
} from "@coreui/react";

function AddTableDrawer({ visible, onClose, onSave, formMode, initialData }) {
  const [tableCode, setTableCode] = useState("");
  const [seatingCapacity, setSeatingCapacity] = useState("");
  const [areaId, setAreaId] = useState("");
  const [status, setStatus] = useState("available");
  const [isSync, setisSync] = useState(false);
  const [areas, setAreas] = useState([]);

  // 🔹 Load Areas
  const loadAreas = async () => {
    try {
      const data = await window.api.getAreas();
      setAreas(Array.isArray(data) ? data : []); // ensure always array
    } catch (err) {
      console.error("Failed to load areas:", err);
      setAreas([]);
    }
  };

  useEffect(() => {
    if (visible) {
      loadAreas();
    }
  }, [visible]);

  // 🔹 Reset form for Add / Edit mode
  useEffect(() => {
    if (formMode === "edit" && initialData) {
      setTableCode(initialData.table_code || "");
      setSeatingCapacity(initialData.seating_capacity?.toString() || "");
      setAreaId(initialData.area_id?.toString() || "");
      setStatus(initialData.status || "available");
      setisSync(initialData.isSync === 1);
    } else {
      setTableCode("");
      setSeatingCapacity("");
      setAreaId("");
      setStatus("available");
      setisSync(false);
    }
  }, [formMode, initialData, visible]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!areaId) {
      alert("Please select an area before saving.");
      return;
    }

    onSave({
      table_code: tableCode.trim(),
      seating_capacity: parseInt(seatingCapacity, 10) || 0,
      area_id: parseInt(areaId, 10),
      status,
      isSync: isSync ? 1 : 0,
    });
  };

  return (
    <div className={`drawer ${visible ? "open" : ""}`}>
      <div className="drawer-header">
        <h5>{formMode === "edit" ? "Edit Table" : "Add Table"}</h5>
      </div>
      <div className="drawer-body">
        <CForm onSubmit={handleSubmit}>
          {/* Table Code */}
          <CRow className="mb-3">
            <CCol>
              <CFormInput
                label="Table Code"
                value={tableCode}
                onChange={(e) => setTableCode(e.target.value)}
                required
              />
            </CCol>
          </CRow>

          {/* Seating Capacity */}
          <CRow className="mb-3">
            <CCol>
              <CFormInput
                label="Seating Capacity"
                type="number"
                min="1"
                value={seatingCapacity}
                onChange={(e) => setSeatingCapacity(e.target.value)}
                required
              />
            </CCol>
          </CRow>

          {/* Area Dropdown */}
          <CRow className="mb-3">
            <CCol>
              <CFormSelect
                label="Select Area"
                value={areaId}
                onChange={(e) => setAreaId(e.target.value)}
                required
              >
                <option value="">-- Select Area --</option>
                {(areas || []).map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.area_name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>

          {/* Sink Switch */}
          <CRow className="mb-3">
            <CCol>
              <CFormSwitch
                label="Sink Available"
                checked={isSync}
                onChange={(e) => setisSync(e.target.checked)}
              />
            </CCol>
          </CRow>

          {/* Actions */}
          <div className="d-flex justify-content-end">
            <CButton color="secondary" onClick={onClose} className="me-2">
              Cancel
            </CButton>
            <CButton type="submit" color="primary">
              {formMode === "edit" ? "Update" : "Save"}
            </CButton>
          </div>
        </CForm>
      </div>
    </div>
  );
}

export default AddTableDrawer;
