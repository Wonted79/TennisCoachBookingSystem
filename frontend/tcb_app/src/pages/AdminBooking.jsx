import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Booking.css';
import './AdminBooking.css';

// 예약 상태 상수
const BOOKING_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  HELD: 'held',
};

function AdminBooking() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  // 관리자가 아니면 접근 불가
  if (!isAdmin()) {
    return (
      <div className="booking">
        <div className="access-denied">
          <h2>접근 권한이 없습니다</h2>
          <p>관리자만 접근할 수 있는 페이지입니다.</p>
          <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
        </div>
      </div>
    );
  }

  // 현재 주의 시작일 (월요일 기준)
  const [weekStartDate, setWeekStartDate] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });

  // 예약 데이터 상태
  const [bookings, setBookings] = useState({});

  // 선택된 셀 상태
  const [selectedCell, setSelectedCell] = useState(null);

  // 시간 슬롯 생성 (6:00 ~ 21:30, 30분 단위)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 6; hour <= 21; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 21 || (hour === 21 && slots.length < 32)) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  }, []);

  // 요일 배열
  const days = ['월', '화', '수', '목', '금', '토', '일'];

  // 주간 날짜 생성
  const weekDates = useMemo(() => {
    return days.map((day, index) => {
      const date = new Date(weekStartDate);
      date.setDate(weekStartDate.getDate() + index);
      return {
        day,
        date: date.getDate(),
        month: date.getMonth() + 1,
        fullDate: new Date(date),
      };
    });
  }, [weekStartDate]);

  // 예약 상태 가져오기
  const getBookingStatus = (dateInfo, time) => {
    const dateKey = dateInfo.fullDate.toISOString().split('T')[0];
    return bookings[dateKey]?.[time] || BOOKING_STATUS.AVAILABLE;
  };

  // 예약 상태 변경
  const setBookingStatus = (dateInfo, time, status) => {
    const dateKey = dateInfo.fullDate.toISOString().split('T')[0];
    setBookings((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [time]: status,
      },
    }));
    setSelectedCell(null);
  };

  // 이전 주로 이동
  const goToPreviousWeek = () => {
    const newDate = new Date(weekStartDate);
    newDate.setDate(weekStartDate.getDate() - 7);
    setWeekStartDate(newDate);
  };

  // 다음 주로 이동
  const goToNextWeek = () => {
    const newDate = new Date(weekStartDate);
    newDate.setDate(weekStartDate.getDate() + 7);
    setWeekStartDate(newDate);
  };

  // 셀 클릭 핸들러
  const handleCellClick = (dateInfo, time) => {
    const cellKey = `${dateInfo.fullDate.toISOString().split('T')[0]}-${time}`;
    if (selectedCell === cellKey) {
      setSelectedCell(null);
    } else {
      setSelectedCell(cellKey);
    }
  };

  // 현재 표시 중인 주 텍스트
  const weekRangeText = useMemo(() => {
    const endDate = new Date(weekStartDate);
    endDate.setDate(weekStartDate.getDate() + 6);
    const startMonth = weekStartDate.getMonth() + 1;
    const startDay = weekStartDate.getDate();
    const endMonth = endDate.getMonth() + 1;
    const endDay = endDate.getDate();
    return `${startMonth}월 ${startDay}일 ~ ${endMonth}월 ${endDay}일`;
  }, [weekStartDate]);

  return (
    <div className="booking admin-booking">
      {/* Header */}
      <header className="booking-header admin-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← 뒤로
        </button>
        <h1>예약 관리 (관리자)</h1>
        <span className="admin-badge">관리자 모드</span>
      </header>

      {/* Legend */}
      <div className="booking-legend admin-legend">
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
        <div className="legend-instruction">
          <span>셀을 클릭하여 상태를 변경하세요</span>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="week-navigation">
        <button className="nav-button" onClick={goToPreviousWeek}>
          ◀ 이전 주
        </button>
        <span className="week-range">{weekRangeText}</span>
        <button className="nav-button" onClick={goToNextWeek}>
          다음 주 ▶
        </button>
      </div>

      {/* Booking Table */}
      <div className="booking-table-wrapper">
        <table className="booking-table">
          <thead>
            <tr>
              <th className="time-header">시간</th>
              {weekDates.map((dateInfo, index) => (
                <th key={index} className="day-header">
                  <div className="day-name">{dateInfo.day}</div>
                  <div className="day-date">{dateInfo.month}/{dateInfo.date}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time}>
                <td className="time-cell">{time}</td>
                {weekDates.map((dateInfo, dayIndex) => {
                  const status = getBookingStatus(dateInfo, time);
                  const cellKey = `${dateInfo.fullDate.toISOString().split('T')[0]}-${time}`;
                  const isSelected = selectedCell === cellKey;

                  return (
                    <td
                      key={dayIndex}
                      className={`booking-cell admin-cell ${status} ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleCellClick(dateInfo, time)}
                    >
                      {status === BOOKING_STATUS.BOOKED && '예약'}
                      {status === BOOKING_STATUS.HELD && '임시'}

                      {/* 상태 변경 팝업 */}
                      {isSelected && (
                        <div className="status-popup">
                          <button
                            className="status-btn available-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setBookingStatus(dateInfo, time, BOOKING_STATUS.AVAILABLE);
                            }}
                          >
                            예약 가능
                          </button>
                          <button
                            className="status-btn booked-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setBookingStatus(dateInfo, time, BOOKING_STATUS.BOOKED);
                            }}
                          >
                            예약 완료
                          </button>
                          <button
                            className="status-btn held-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setBookingStatus(dateInfo, time, BOOKING_STATUS.HELD);
                            }}
                          >
                            임시 예약
                          </button>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminBooking;
