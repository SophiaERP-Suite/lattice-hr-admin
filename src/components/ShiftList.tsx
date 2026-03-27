import React from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

interface Shift {
  shiftId: number;
  shiftName: string;
  startTime: string;
  endTime: string;
  days: string[];
}

interface ShiftListProps {
  shifts: Shift[];
}

const ShiftList: React.FC<ShiftListProps> = ({ shifts }) => {
  const formatTime = (time: string) => {
    return dayjs(time, 'HH:mm:ss').format('HH:mm');
  };

  return (
    <div className="container mt-15">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="fw-semibold mb-0">Shift Schedule</h4>
        <span className="text-muted small">
          {shifts.length} {shifts.length === 1 ? "Shift" : "Shifts"}
        </span>
      </div>
      <hr />
      {shifts.length === 0 ? (
        <div className="text-center py-5 text-black mt-15">
          <i className="bi bi-calendar-x fs-1 mb-3 d-block"></i>
          No shifts assigned to this job
        </div>
      ) : (
        <div className="row g-4 mt-15">
          {shifts.map((shift) => (
            <div key={shift.shiftId} className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100 shift-card">
                <div className="card-body">

                  {/* Shift Name */}
                  <div className="mb-3">
                    <h5 className="fw-semibold mb-1">
                      {shift.shiftName}
                    </h5>
                    <div className="text-muted small">
                      Shift ID: {shift.shiftId}
                    </div>
                  </div>

                  {/* Time Section */}
                  <div className="mb-4">
                    <div className="text-muted small mb-1">Working Hours</div>
                    <div className="fs-5 fw-medium">
                      {formatTime(shift.startTime)} – {formatTime(shift.endTime)}
                    </div>
                  </div>

                  {/* Days Section */}
                  <div>
                    <div className="text-muted small mb-2">Days</div>

                    {shift.days && shift.days.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {shift.days.map((day, index) => (
                          <span
                            key={index}
                            className="badge rounded-pill bg-light text-dark border px-3 py-2"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted small">
                        No days assigned
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

  );
};

export default ShiftList;