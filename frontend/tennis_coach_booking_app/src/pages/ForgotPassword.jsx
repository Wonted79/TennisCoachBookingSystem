import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import './ForgotPassword.css';

function ForgotPassword() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email) {
      setError('아이디와 이메일을 모두 입력해주세요.');
      return;
    }

    // 실제로는 API 호출
    console.log('비밀번호 찾기 요청:', formData);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="success-message">
            <div className="success-icon email-icon">✉</div>
            <h2>이메일 발송 완료</h2>
            <p>
              입력하신 이메일로 임시 비밀번호가 발송되었습니다.
              <br />
              이메일을 확인해주세요.
            </p>
            <Link to="/login" className="back-to-login-button">
              로그인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <span>123</span>
          </div>
          <h1>비밀번호 찾기</h1>
          <p>가입 시 등록한 정보를 입력해주세요</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">아이디</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="가입 시 등록한 이메일"
            />
          </div>

          <button type="submit" className="login-button">
            비밀번호 찾기
          </button>
        </form>

        <div className="login-back">
          <Link to="/login">← 로그인으로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
