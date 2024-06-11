import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Img1 from "./Assetes/Images/Img1.jpg";
import Img2 from "./Assetes/Images/Img2.jpg";
import Img3 from "./Assetes/Images/Img3.jpg";
import Img4 from "./Assetes/Images/Img4.webp";
import Img5 from "./Assetes/Images/Img5.jpg";
const ImageSlider = () => {
  const images = [Img1, Img2, Img3, Img4, Img5];
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // set the duration between slide transitions in milliseconds
  };

  return (
    <Slider {...settings}>
      {images.map((image) => (
        <div key={image}>
          <img
            style={{
              margin: "auto",
              height: "98vh",
              width: "100vw",
              borderBottomLeftRadius: "20px",
            }}
            src={image}
            alt="slide"
          />
        </div>
      ))}
    </Slider>
  );
};

function ImgApp() {
  return <ImageSlider />;
}

export default ImgApp;
