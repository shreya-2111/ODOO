import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import apiService from '../services/api';

const ResourceBooking = () => {
  const { addNotification } = useApp();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  // State lists
  const [resources, setResources] = useState([]);
  const [selectedResourceId, setSelectedResourceId] = useState('');
  const [bookings, setBookings] = useState([]);

  // Form states - locked by slot selection
  const [teamName, setTeamName] = useState('');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('11:00 AM');

  const fetchResourcesAndBookings = () => {
    apiService.assets.list()
      .then(res => {
        const shared = res.data.filter(a => a.is_shared_resource);
        setResources(shared);
        if (shared.length > 0 && !selectedResourceId) {
          setSelectedResourceId(shared[0].id);
        }
      })
      .catch(err => console.error("Error loading resources:", err));

    apiService.bookings.list()
      .then(res => setBookings(res.data))
      .catch(err => console.error("Error loading bookings:", err));
  };

  useEffect(() => {
    fetchResourcesAndBookings();
  }, []);

  const scheduleTimes = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  const getBookingForTime = (timeStr) => {
    const targetHour = Number(timeStr.split(':')[0]);
    return bookings.find(b => {
      if (b.resource_id !== Number(selectedResourceId)) return false;
      if (b.status === "Cancelled") return false;
      
      const bStart = new Date(b.start_time);
      const bEnd = new Date(b.end_time);
      
      const startHour = bStart.getHours();
      const endHour = bEnd.getHours();
      
      return targetHour >= startHour && targetHour < endHour;
    });
  };

  const activeSlots = scheduleTimes.map((time) => {
    const b = getBookingForTime(time);
    return {
      time: time,
      booked: b ? {
        text: `Booked - ${b.employee?.full_name || 'Active Booking'} - ${new Date(b.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} to ${new Date(b.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
        start: b.start_time,
        end: b.end_time
      } : null
    };
  });

  const handleBookSlot = (e) => {
    e.preventDefault();
    if (!selectedResourceId) return;

    const todayStr = new Date().toISOString().split('T')[0];
    
    const parseTime = (tStr) => {
      const [time, modifier] = tStr.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') hours = '00';
      if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
      return `${String(hours).padStart(2, '0')}:${minutes}:00`;
    };

    const startISO = `${todayStr}T${parseTime(startTime)}`;
    const endISO = `${todayStr}T${parseTime(endTime)}`;

    apiService.bookings.create({
      resource_id: Number(selectedResourceId),
      employee_id: user?.id || 1,
      start_time: startISO,
      end_time: endISO
    })
    .then(() => {
      addNotification('success', `Resource booking confirmed for ${startTime}`);
      fetchResourcesAndBookings();
    })
    .catch((err) => {
      addNotification('danger', err.response?.data?.detail || 'Failed to book slot');
    });

    setTeamName('');
    setShowModal(false);
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h1 className="h4 fw-bold mb-1 text-dark">Resource Booking</h1>
          <p className="text-muted small mb-0">Reserve conference meeting rooms, fleet vehicles, and shared workspace devices</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <select 
            className="form-select border-secondary-subtle" 
            style={{ width: '260px', fontWeight: '500', fontSize: '0.875rem' }}
            value={selectedResourceId}
            onChange={(e) => setSelectedResourceId(e.target.value)}
          >
            {resources.length === 0 ? (
              <option value="">No resources configured</option>
            ) : (
              resources.map((r, idx) => (
                <option key={idx} value={r.id}>{r.name} ({r.location})</option>
              ))
            )}
          </select>

          <button className="btn-wire d-flex align-items-center gap-1" onClick={() => setShowModal(true)} disabled={resources.length === 0}>
            <i className="bi bi-calendar-plus"></i>
            <span>Book a slot</span>
          </button>
        </div>
      </div>

      <div className="schedule-container shadow-sm mb-4">
        <div className="p-3 bg-light border-bottom border-secondary-subtle d-flex justify-content-between align-items-center">
          <span className="fw-semibold text-secondary">
            {resources.find(r => r.id === Number(selectedResourceId))?.name || 'Selected Agenda'}
          </span>
          <span className="badge bg-secondary px-2 py-1 rounded-pill">Daily Agenda</span>
        </div>

        {resources.length === 0 ? (
          <div className="text-center py-4 text-muted">
            No shared bookable resources exist in the database directory. Mark an asset as "Shared Bookable Resource" to schedule.
          </div>
        ) : (
          activeSlots.map((slot, index) => (
            <div className="schedule-row" key={index}>
              <div className="schedule-time">{slot.time}</div>
              <div className="schedule-slot">
                {slot.booked ? (
                  <div className="booked-slot shadow-sm">
                    <i className="bi bi-clock-fill me-2"></i>
                    {slot.booked.text}
                  </div>
                ) : (
                  <button 
                    className="btn btn-sm btn-link text-decoration-none text-muted py-0 px-0 fs-7"
                    onClick={() => {
                      const formattedTime = slot.time.includes('09:') || slot.time.includes('10:') || slot.time.includes('11:') || slot.time.includes('12:')
                        ? `${slot.time.replace(/^0/, '')} AM`
                        : `${slot.time.startsWith('12') ? '12:00' : String(Number(slot.time.split(':')[0]) - 12).padStart(2, '0').replace(/^0/, '') + ':00'} PM`;
                      setStartTime(formattedTime);
                      
                      const timeNum = Number(slot.time.split(':')[0]);
                      const nextTime = timeNum === 12 ? '1:00 PM' : timeNum + 1 > 12 ? `${timeNum + 1 - 12}:00 PM` : `${timeNum + 1}:00 AM`;
                      setEndTime(nextTime);
                      setShowModal(true);
                    }}
                  >
                    + Available slot (Click to book)
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Schedule Resource Booking"
        footerActions={
          <>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-sm btn-wire" onClick={handleBookSlot}>Book Slot</button>
          </>
        }
      >
        <form onSubmit={handleBookSlot} className="row g-3">
          <div className="col-12">
            <label className="form-label small fw-semibold text-muted">Select Resource</label>
            <input 
              type="text" 
              className="form-control form-control-erp bg-light" 
              value={resources.find(r => r.id === Number(selectedResourceId))?.name || ''} 
              disabled 
            />
          </div>

          <div className="col-12">
            <label className="form-label small fw-semibold text-muted">Booking Team / Employee Name</label>
            <input 
              type="text" 
              className="form-control form-control-erp" 
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Engineering Sync Team"
              required
            />
          </div>

          <div className="col-md-6 col-12">
            <label className="form-label small fw-semibold text-muted">Start Time</label>
            <input 
              type="text" 
              className="form-control form-control-erp bg-light" 
              value={startTime} 
              readOnly 
            />
          </div>

          <div className="col-md-6 col-12">
            <label className="form-label small fw-semibold text-muted">End Time</label>
            <input 
              type="text" 
              className="form-control form-control-erp bg-light" 
              value={endTime} 
              readOnly 
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ResourceBooking;
