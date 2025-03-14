import React, { useState } from 'react';

import Image from 'next/image';
import OnBoardingCarousel from './OnBoardingCarousel';

interface OnBoardingModalProps {
  onClose: () => void;
  //필요 props 추가할거 있으면 해야할듯 합니다.
}

const OnBoardingModal: React.FC<OnBoardingModalProps> = ({ onClose }) => {
  //carousel IMG Array
  const slides = [
    {
      background: '/IMG/slide1.png',
      title: '새 과목 폴더를 만들어보세요',
      desc: '이미 만든 폴더는 내용을 수정하거나 삭제할 수 있어요!',
    },
    {
      background: '/IMG/slide2.png',
      title:
        '새 노트 만들기로 학습 콘텐츠를 생성하고, 노트를 리스트로 관리하세요!',
      desc: '더 이상 필요없는 노트는 삭제할 수 있어요.',
    },
    {
      background: '/IMG/slide3.png',
      title:
        '새 노트 만들기로 학습 콘텐츠를 생성하고, 노트를 리스트로 관리하세요!',
      desc: '더 이상 필요없는 노트는 삭제할 수 있어요.',
    },
    {
      background: '/IMG/slide4.png',
      title: '핵심 키워드와 요구사항을 입력해보세요!',
      desc: '핵심 키워드를 토대로 요약본을 제공해드립니다.',
    },
    {
      background: '/IMG/slide5.png',
      title: '요약분을 바탕으로 복습 퀴즈와 하이라이트 영상을 제작해보세요!',
      desc: '효율적인 학습을 위한 자료를 제공해드립니다',
    },

    {
      background: '/IMG/slide6.png',
      title: '필요한 문제 개수와 원하는 문제 유형을 선택하세요!',
      desc: '만들기 버튼으로 문제를 직접 만들어보세요!',
    },
  ];

  const [slideIndex, setSlideIndex] = useState(0);

  const handleSlideClicked = (index: number) => {
    setSlideIndex(index);
  };

  return (
    <div
      className="fixed flex flex-col z-50 inset-0 items-center justify-center bg-black bg-opacity-50 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[800px] h-[200px] max-w-full bg-transparent -translate-y-20
      "
      >
        <div className="relative w-full">
          <Image
            className="w-full object-cover rounded-t-lg"
            src={slides[slideIndex].background}
            alt="온보딩 배경"
            width={600}
            height={100}
            priority
          ></Image>
        </div>
        <OnBoardingCarousel
          slides={slides}
          onSlideChange={handleSlideClicked}
        ></OnBoardingCarousel>{' '}
        <button
          className="absolute top-4 right-1 bg-transparent text-white px-3 py-1 rounded-md"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default OnBoardingModal;
