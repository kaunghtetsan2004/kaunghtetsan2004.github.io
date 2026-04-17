<?php
include "layouts/navbar.php";
?>

<div id="carouselExampleCaptions" class="carousel slide">
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="images/Bunner/bunner2 (1).jpg" class="d-block w-100" alt="...">
      <div class="carousel-caption d-none d-md-block translate-middle-y">
        <h5 class="text-start">ThinGyan Promotion</h5>
         <h5 class="text-start display-6 fw-bold mb-2">See the World Through a Better Lens</h5>
      </div>
    </div>
    <div class="carousel-item">
      <img src="images/Bunner/bunner2 (2).jpg" class="d-block w-100" alt="...">
      <div class="carousel-caption d-none d-md-block">
        <h5>Second slide label</h5>
        <p>Some representative placeholder content for the second slide.</p>
      </div>
    </div>
    <div class="carousel-item">
      <img src="images/Bunner/bunner2 (3).jpg" class="d-block w-100" alt="...">
      <div class="carousel-caption d-none d-md-block">
        <h5>Third slide label</h5>
        <p>Some representative placeholder content for the third slide.</p>
      </div>
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>

 <div class="container text-center">
    <h3 class="text-danger my-3 fw-bold">Product</h3>
  <div class="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
    <div class="col">
      <div class="p-3">
        <img src="images/Featureproduct/Cannon lp.jpg" class="card-img-top" alt="">
        <p class="fw-bold" id="name">Canon</p>
        <h5 class="fw-bold" id="price">2500000 MMK</h5>
        <button type="button" class="btn btn-outline-dark">Detail</button>
        <button type="button" class="btn btn-danger" data-id="1" data-name="Cannon" data-price="2500000">Buy</button>
      </div>
    </div>
    <div class="col">
      <div class="p-3">
        <img src="images/Featureproduct/cannon rf/cannon rf.jpg" class="card-img-top" alt="">
        <p class="fw-bold" id="name">Canon Len</p>
        <h5 class="fw-bold" id="price">4500000 MMK</h5>
        <button type="button" class="btn btn-outline-dark">Detail</button>
        <button type="button" class="btn btn-danger addToCart" data-id="2" data-name="Cannon Len" data-price="450000">Buy</button>
      </div>
    </div>
    <div class="col">
      <div class="p-3">
        <img src="images/Featureproduct/lightGopro/light1.jpg" class="card-img-top" alt="">
        <p class="fw-bold" id="name">GoPro</p>
        <h5 class="fw-bold" id="price">1500000 MMK</h5>
        <button type="button" class="btn btn-outline-dark">Detail</button>
        <button type="button" class="btn btn-danger addToCart" data-id="3" data-name="GoPro" data-price="1500000">Buy</button>
      </div>
    </div>
    <div class="col">
      <div class="p-3">
        <img src="images/Featureproduct/Gopro/Goprohero 1.jpg" class="card-img-top" alt="">
        <p class="fw-bold">GoPro Len</p>
        <h5 class="fw-bold">4500000 MMK</h5>
        <button type="button" class="btn btn-outline-dark">Detail</button>
        <button type="button" class="btn btn-danger">Buy</button>
      </div>
    </div>
    <div class="col">
      <div class="p-3">
        <img src="images/Featureproduct/Goproremote/remote1.jpg" class="card-img-top" alt="">
        <p class="fw-bold">GoPro Remote</p>
        <h5 class="fw-bold">300000 MMK</h5>
        <button type="button" class="btn btn-outline-dark">Detail</button>
        <button type="button" class="btn btn-danger">Buy</button>
      </div>
    </div>
    <div class="col">
      <div class="p-3">Row column</div>
    </div>
    <div class="col">
      <div class="p-3">Row column</div>
    </div>
    <div class="col">
      <div class="p-3">Row column</div>
    </div>
    <div class="col">
      <div class="p-3">Row column</div>
    </div>
    <div class="col">
      <div class="p-3">Row column</div>
    </div>
  </div>
</div>


<?php
include "layouts/footer.php";
?>