import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import dynamic from 'next/dynamic';
import React from 'react';

const Slider = dynamic(() => import('react-slick'), { ssr: false });

const CustomPrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-3xl cursor-pointer z-10"
    >
      ❮
    </div>
  );
};

const CustomNextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-3xl cursor-pointer z-10"
    >
      ❯
    </div>
  );
};

interface SlideData {
  background: string;
  title: string;
  desc: string;
}
interface OnBoardingCarouselProps {
  slides: SlideData[];
  onSlideChange: (index: number) => void;
}

const OnBoardingCarousel: React.FC<OnBoardingCarouselProps> = ({
  slides,
  onSlideChange,
}) => {
  const carouselSetting = {
    dots: true,
    customPaging: (i: number) => (
      <div className="w-1 h-1 rounded-full bg-gray-300" />
    ),
    appendDots: (dots: React.ReactNode) => (
      <ul className="flex justify-center gap-3 list-none absolute w-full top-1">
        {React.Children.map(dots, (dot) => {
          const element = dot as React.ReactElement<any>;
          const isActive =
            element.props.className &&
            element.props.className.includes('slick-active');
          return (
            <li
              key={element.key || Math.random()}
              onClick={element.props.onClick}
              className="cursor-pointer"
            >
              <div
                className={`w-3 h-3 rounded-full relative bottom-6 ${
                  isActive ? 'bg-primary' : 'bg-gray-300'
                }`}
              ></div>
            </li>
          );
        })}
      </ul>
    ),
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    afterChange: (current: number) => {
      if (onSlideChange) onSlideChange(current);
    },
    beforeChange: (oldIndex: number, newIndex: number) => {
      if (onSlideChange) onSlideChange(newIndex);
    },
  };

  return (
    <div className="relative w-full h-[130px] bg-white">
      <Slider className="w-full h-full" {...carouselSetting}>
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-center items-center h-full"
          >
            <p className="text-black font-semibold mt-4">{slide.title}</p>
            <p className="mt-2 text-black">{slide.desc}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default OnBoardingCarousel;
