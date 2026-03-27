import React, { useState, useEffect } from "react";
import { getEmployerShifts } from "../api/ShiftsApi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Shift {
  shiftId: number;
  shiftName: string;
  startTime: string;
  endTime: string;
  days: string[];
}

interface Props {
  selectedShifts: number[];
  setSelectedShifts: (ids: number[]) => void;
  employerId: number
}

const ShiftSelectorPanel: React.FC<Props> = ({ selectedShifts, setSelectedShifts, employerId }) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployerShifts()

  }, []);

  const fetchEmployerShifts = async () => {
    setLoading(true)
    try {
      const response = await getEmployerShifts(employerId)

      if (response.statusCode === 200) {
        setShifts(response.data);
      }

      console.log("shift", response)
    } catch {
      console.error("Failed to fetch shifts")
    } finally {
      setLoading(false)
    }

  }

  const toggleShift = (shiftId: number) => {
    if (selectedShifts.includes(shiftId)) {
      setSelectedShifts(selectedShifts.filter(id => id !== shiftId));
    } else {
      setSelectedShifts([...selectedShifts, shiftId]);
    }
  };

  if (loading) return <p>Loading shifts...</p>;
  if (!shifts.length) return <p>No shifts available</p>;

  const formatTime = (time: string) => dayjs(`1970-01-01T${time}`).format("h:mm A");

  return (
    <div className="col-12">
      <div className="row">
        <div className="col-md-6 shift-grid">
          {shifts.map(shift => (
            <div key={shift.shiftId} className="shift-item " style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", borderRadius: "6px" }}>
              <label className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedShifts.includes(shift.shiftId)}
                  onChange={() => toggleShift(shift.shiftId)}
                />
                <strong style={{ marginLeft: "10px", marginRight: "10px" }}>{shift.shiftName}</strong> {formatTime(shift.startTime)} - {formatTime(shift.endTime)}

              </label>
              {/* <div style={{ marginLeft: "20px" }}>
            Days: {shift.days.join(", ")}
          </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};

export default ShiftSelectorPanel;
