import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Megaphone, Phone } from 'lucide-react';
import './Booking.css';

const BOOKING_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  HELD: 'held',
};

const DAY_KEYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const DAYS_KO = ['월', '화', '수', '목', '금', '토', '일'];

function Booking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const coachId = searchParams.get('coachId');

  const [bookings, setBookings] = useState({});
  const [noticeText, setNoticeText] = useState('');
  const [coachName, setCoachName] = useState('');
  const [coachPhone, setCoachPhone] = useState('');

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 6; hour <= 21; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 21) slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    slots.push('21:30');
    return slots;
  }, []);

  // 코치 정보 로드
  useEffect(() => {
    if (!coachId) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/public/coach?coachId=${coachId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (data?.name) setCoachName(data.name);
        if (data?.phone) setCoachPhone(data.phone);
      })
      .catch((err) => console.error('코치 정보 로드 실패:', err));
  }, [coachId]);

  // 공지사항 로드
  useEffect(() => {
    if (!coachId) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/public/notice?coachId=${coachId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => { if (data?.content) setNoticeText(data.content); })
      .catch((err) => console.error('공지사항 로드 실패:', err));
  }, [coachId]);

  // 예약 데이터 로드
  useEffect(() => {
    if (!coachId) return;
    let cancelled = false;
    fetch(`${import.meta.env.VITE_API_URL}/api/reservation/public?coachId=${coachId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (cancelled) return;
        const mapped = {};
        data.forEach((r) => {
          if (!mapped[r.dayOfWeek]) mapped[r.dayOfWeek] = {};
          mapped[r.dayOfWeek][r.time] =
            r.status === 'HELD' ? BOOKING_STATUS.HELD : BOOKING_STATUS.BOOKED;
        });
        setBookings(mapped);
      })
      .catch((err) => console.error('예약 데이터 로드 실패:', err));
    return () => { cancelled = true; };
  }, [coachId]);

  const getBookingStatus = (dayIndex, time) => {
    const dayKey = DAY_KEYS[dayIndex];
    return bookings[dayKey]?.[time] || BOOKING_STATUS.AVAILABLE;
  };

  return (
    <div className="booking">
      <header className="booking-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← 뒤로
        </button>
        <h1>{coachName ? `${coachName} 코치 레슨 예약` : '레슨 예약'}</h1>
      </header>

      {noticeText && (
        <div className="announcement-banner">
          <div className="announcement-row">
            <Megaphone size={18} />
            <span className="announcement-text">{noticeText}</span>
          </div>
          <div className="announcement-row inquiry-row">
            <Phone size={16} />
            <span className="inquiry-text">레슨 문의: {coachPhone ? coachPhone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3') : '-'}</span>
          </div>
        </div>
      )}

      <div className="booking-legend">
        <div className="legend-item">
          <span className="legend-color available"></span>
          <span>예약 가능</span>
        </div>
        <div className="legend-item">
          <span className="legend-color booked"></span>
          <span>예약 완료</span>
        </div>
        <div className="legend-item">
          <span className="legend-color held"></span>
          <span>임시 예약</span>
        </div>
      </div>

      <div className="booking-table-wrapper">
        <table className="booking-table">
          <thead>
            <tr>
              <th className="time-header">시간</th>
              {DAYS_KO.map((day, index) => (
                <th key={index} className="day-header">
                  <div className="day-name">{day}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time}>
                <td className="time-cell">{time}</td>
                {DAY_KEYS.map((_, dayIndex) => (
                  <td
                    key={dayIndex}
                    className={`booking-cell ${getBookingStatus(dayIndex, time)}`}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Booking;
