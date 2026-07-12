import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';

const ResourceBooking = () => {
  const { addNotification } = useApp();
  const [selectedResource, setSelectedResource] = useState('Conference room 4A - New York');
  const [showModal, setShowModal] = useState(false);

  // Form states - locked by slot selection
  const [teamName, setTeamName] = useState('');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('11:00 AM');

  // Bookings state maps. Seeded with completely different demo events for visual distinction
  const [bookingsMap, setBookingsMap] = useState({
    'Conference room 4A - New York': [
      { time: '9:00', booked: null },
      { time: '10:00', booked: { text: 'Booked - Product team - 10:00 AM to 11:30 AM', start: '10:00 AM', end: '11:30 AM' } },
      { time: '11:00', booked: { text: 'Projected slot 11:30 AM to 12:00 PM - CEO meeting', start: '11:30 AM', end: '12:00 PM' } },
      { time: '12:00', booked: null },
      { time: '1:00', booked: null },
      { time: '2:00', booked: null },
      { time: '3:00', booked: null },
      { time: '4:00', booked: null }
    ],
    'London Boardroom 1': [
      { time: '9:00', booked: { text: 'Booked - UK Marketing Sync - 9:00 AM to 10:00 AM', start: '9:00 AM', end: '10:00 AM' } },
      { time: '10:00', booked: null },
      { time: '11:00', booked: null },
      { time: '12:00', booked: { text: 'Booked - Executive Board Lunch - 12:00 PM to 1:30 PM', start: '12:00 PM', end: '1:30 PM' } },
      { time: '1:00', booked: null },
      { time: '2:00', booked: null },
      { time: '3:00', booked: { text: 'Booked - Facilities Review - 3:00 PM to 4:00 PM', start: '3:00 PM', end: '4:00 PM' } },
      { time: '4:00', booked: null }
    ],
    'Tokyo Meeting Pod 3': [
      { time: '9:00', booked: null },
      { time: '10:00', booked: { text: 'Booked - Engineering Sync - 10:00 AM to 11:00 AM', start: '10:00 AM', end: '11:00 AM' } },
      { time: '11:00', booked: null },
      { time: '12:00', booked: null },
      { time: '1:00', booked: null },
      { time: '2:00', booked: { text: 'Booked - Candidate Interview - 2:00 PM to 3:00 PM', start: '2:00 PM', end: '3:00 PM' } },
      { time: '3:00', booked: null },
      { time: '4:00', booked: { text: 'Booked - Daily Standup - 4:00 PM to 4:30 PM', start: '4:00 PM', end: '4:30 PM' } }
    ],
    'Toyota RAV4 Hybrid (2025)': [
      { time: '9:00', booked: { text: 'Booked - Field Operations NY - 9:00 AM to 12:00 PM', start: '9:00 AM', end: '12:00 PM' } },
      { time: '10:00', booked: null },
      { time: '11:00', booked: null },
      { time: '12:00', booked: null },
      { time: '1:00', booked: { text: 'Booked - Mail Delivery Run - 1:00 PM to 2:00 PM', start: '1:00 PM', end: '2:00 PM' } },
      { time: '2:00', booked: null },
      { time: '3:00', booked: null },
      { time: '4:00', booked: null }
    ]
  });

  const handleBookSlot = (e) => {
    e.preventDefault();
    if (!teamName || !startTime || !endTime) return;

    // Match selected start time (e.g. "10:00 AM" -> "10:00")
    const cleanTime = startTime.split(' ')[0];

    const currentSlots = bookingsMap[selectedResource] || [];
    const updatedSlots = currentSlots.map((slot) => {
      if (slot.time === cleanTime) {
        return {
          ...slot,
          booked: {
            text: `Booked - ${teamName} - ${startTime} to ${endTime}`,
            start: startTime,
            end: endTime
          }
        };
      }
      return slot;
    });

    setBookingsMap({
      ...bookingsMap,
      [selectedResource]: updatedSlots
    });

    addNotification('success', `Resource booking confirmed for ${teamName} at ${startTime}`);
    
    // Reset and close
    setTeamName('');
    setShowModal(false);
  };

  const activeSlots = bookingsMap[selectedResource] || [];

  return (
    <div className="container-fluid p-0">
      {/* Unified Page Header Block */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h1 className="h4 fw-bold mb-1 text-dark">Resource Booking</h1>
          <p className="text-muted small mb-0">Reserve conference meeting rooms, fleet vehicles, and shared workspace devices</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Mapped resource selection dropdown */}
          <select 
            className="form-select border-secondary-subtle" 
            style={{ width: '260px', fontWeight: '500', fontSize: '0.875rem' }}
            value={selectedResource}
            onChange={(e) => setSelectedResource(e.target.value)}
          >
            <option value="Conference room 4A - New York">Conference room 4A - New York</option>
            <option value="London Boardroom 1">London Boardroom 1</option>
            <option value="Tokyo Meeting Pod 3">Tokyo Meeting Pod 3</option>
            <option value="Toyota RAV4 Hybrid (2025)">Toyota RAV4 Hybrid (2025)</option>
          </select>

          <button className="btn-wire d-flex align-items-center gap-1" onClick={() => setShowModal(true)}>
            <i className="bi bi-calendar-plus"></i>
            <span>Book a slot</span>
          </button>
        </div>
      </div>

      {/* Schedule Grid Calendar */}
      <div className="schedule-container shadow-sm mb-4">
        <div className="p-3 bg-light border-bottom border-secondary-subtle d-flex justify-content-between align-items-center">
          <span className="fw-semibold text-secondary">{selectedResource}</span>
          <span className="badge bg-secondary px-2 py-1 rounded-pill">Daily Agenda</span>
        </div>

        {activeSlots.map((slot, index) => (
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
                    const formattedTime = slot.time.includes('9:') || slot.time.includes('10:') || slot.time.includes('11:') || slot.time.includes('12:')
                      ? `${slot.time} AM`
                      : `${slot.time} PM`;
                    setStartTime(formattedTime);
                    
                    const timeNum = Number(slot.time.split(':')[0]);
                    const nextTime = timeNum === 12 ? '1:00 PM' : `${timeNum + 1}:00 ${formattedTime.split(' ')[1]}`;
                    setEndTime(nextTime);
                    setShowModal(true);
                  }}
                >
                  + Available slot (Click to book)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Book Slot Modal */}
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
            <input type="text" className="form-control form-control-erp bg-light" value={selectedResource} disabled />
          </div>

          <div className="col-12">
            <label className="form-label small fw-semibold text-muted">Booking Team / Employee Name</label>
            <input 
              type="text" 
              className="form-control form-control-erp" 
              placeholder="e.g. Product Team" 
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
          </div>

          {/* Changed time selects to read-only text inputs locked to the slot */}
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
