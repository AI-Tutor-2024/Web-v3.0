import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import dynamic from 'next/dynamic';

const Slider = dynamic(() => import('react-slick'), { ssr: false }); //서버 실행 방지 !ssr

const OnBoardingCarousel = () => {
  const carouselSetting = {
    //캐러셀 Props
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <Slider
      className="relative h-[100px] flex flex-col items-center justify-center"
      {...carouselSetting}
    >
      <div className="h-full flex flex-col justify-center items-center bg-white">
        <h2 className="text-xl font-semibold">📂 새 과목 폴더 만들기</h2>
        <p className="mt-2 text-black">
          이미 만든 폴더는 수정하거나 삭제할 수 있어요!
        </p>
      </div>
      <div className="h-full flex flex-col justify-center items-center bg-white">
        <h2 className="text-xl font-semibold">📁 강의 관리하기</h2>
        <p className="mt-2 text-black">강의 내용을 효과적으로 관리하세요!</p>
      </div>
      <div className="h-full flex flex-col justify-center items-center bg-white">
        <h2 className="text-xl font-semibold">🎯 목표 설정</h2>
        <p className="mt-2 text-black">학습 목표를 설정하고 달성해 보세요!</p>
      </div>
    </Slider>
  );
};

export default OnBoardingCarousel;
