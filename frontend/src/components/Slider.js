import React from "react";
import Slider from "react-slick";
import "./Slider.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function CMode() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  const products = [
    {
      id: 1,
      name: "Yellow Shirt",
      price: 499,
      discount: "Upto 10% off",
      image:
        "https://plus.unsplash.com/premium_photo-1683140435505-afb6f1738d11?auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 2,
      name: "Yellow Shirt",
      price: 499,
      discount: "Upto 10% off",
      image:
        "https://plus.unsplash.com/premium_photo-1683140435505-afb6f1738d11?auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 3,
      name: "Yellow Shirt",
      price: 499,
      discount: "Upto 10% off",
      image:
        "https://plus.unsplash.com/premium_photo-1683140435505-afb6f1738d11?auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 4,
      name: "Yellow Shirt",
      price: 499,
      discount: "Upto 10% off",
      image:
        "https://plus.unsplash.com/premium_photo-1683140435505-afb6f1738d11?auto=format&fit=crop&w=500&q=60",
    },
  ];

  return (
    <div className="container-fluid my-5">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="carousel-item-wrapper">
            <div className="card product-card">
              <img
                src={product.image}
                className="card-img-top"
                alt={product.name}
              />

              <div className="card-body text-center">
                <h6 className="product-text">{product.name}</h6>

                <div className="product-price">₹{product.price}</div>
                <div className="product-sale">{product.discount}</div>

                <div className="button-group">
                  <button className="btn btn-danger btn-lg">
                    <i className="fa-solid fa-cart-shopping"></i> Cart
                  </button>

                  <button className="btn btn-primary btn-lg">Buy</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CMode;
