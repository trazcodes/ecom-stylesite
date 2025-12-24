import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer text-center" style={{ marginTop: '50px' }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-12">
            <h5>Men</h5>
            <ul className="list-unstyled">
              <li><a href="/product/men/menall.html">All Products</a></li>
              <li><a href="/product/men/menshirt.html">Shirts</a></li>
              <li><a href="/product/men/menhoodie.html">Hoodies</a></li>
              <li><a href="/product/men/menpant.html">Pants</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <h5>Women</h5>
            <ul className="list-unstyled">
              <li><a href="/product/women/womenall.html">All Products</a></li>
              <li><a href="/product/women/womendress.html">Dress</a></li>
              <li><a href="/product/women/womenskirt.html">Skirts</a></li>
              <li><a href="/product/women/womenpant.html">Pants</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <h5>Kids</h5>
            <ul className="list-unstyled">
              <li><a href="/product/kids/kids.html">Dress</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <h5>Others</h5>
            <ul className="list-unstyled">
              <li><a href="/content/contact.html">Contact us</a></li>
              <li><a href="/content/login.html">Login</a></li>
              <li><a href="/content/cart.html">Cart</a></li>
              <li><a href="/homepage.html">Home</a></li>
            </ul>
          </div>
        </div>
      </div>
      <hr />
      <span> &copy; StyleSite 2023-24</span>
    </footer>
  );
}

export default Footer;
