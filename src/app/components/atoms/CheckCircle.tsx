import React from 'react';
import Image from 'next/image';

// `CheckCircle` 컴포넌트 props 타입 정의
interface CheckCircleProps {
  isChecked: boolean; // 체크 상태
  onChange: () => void; // 상태 변경 시 호출되는 콜백 함수
  size?: number; // 버튼의 크기 지정 (기본값: 30)
}

const CheckCircle: React.FC<CheckCircleProps> = ({ isChecked, onChange, size = 30 }) => {
  // 클릭 이벤트 핸들러: 클릭 시 부모로 상태 변경 요청
  const handleClick = () => {
    onChange();
  };

  return (
    <button onClick={handleClick} className="flex items-center justify-center">
      <Image
        src={`/${isChecked ? 'CheckedCircle' : 'UnCheckedCircle'}.svg`}
        alt={isChecked ? 'Checked Circle' : 'UnChecked Circle'}
        width={size}
        height={size}
        style={{ objectFit: 'contain' }}
      />
    </button>
  );
};

export default CheckCircle;