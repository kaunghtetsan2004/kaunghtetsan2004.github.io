<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>


    <link rel="stylesheet" href="bootstrap/css/bootstrap.min.css">
    <script src="bootstrap/js/bootstrap.bundle.min.js"></script>



    <link rel="stylesheet" href="fontawesome/css/all.min.css">
    <script src="fontawesome/js/all.min.js"></script>

    <link rel="stylesheet" href="css/navbar.css">

    <link rel="stylesheet" href="css/bunner.css">

    <script src="../jQuery/jquery.min.js"></script>

</head>

<body>

    <!-- navbar -->

    

    <nav class="navbar navbar-expand-lg bg-black ">
       
        <div class="container mt-2">
             
            <div>
                <button class="navbar-toggler me-auto" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <i class="fa-solid fa-bars icon_color fa-lg"></i>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav  mb-lg-0 ">
                        <li class="nav-item">
                            <a class="nav-link active text-white" aria-current="page" href="#">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-white" href="#">Link</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle text-white" href="#" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                Dropdown
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#">T shirt</a></li>
                                <li><a class="dropdown-item" href="#">Jeans</a></li>
                                <li><a class="dropdown-item" href="#">Shoes</a></li>
                            </ul>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-white" aria-disabled="true">Disabled</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class=" ms-auto">
                <a class="navbar-brand text-white" href="#">Navbar</a>
            </div>
            <div class=" d-flex flex-lg-row align-items-start  ms-auto mt-2">
                <ul class="navbar-nav ms-2 me-lg-2">
                    <li class="nav-item">
                        <a href="login.php" class="nav-link btn text-white">
                            <i class="fa-solid fa-user fa-lg"></i>
                        </a>
                    </li>
                </ul>
                <div class="position-relative me-2  me-lg-2">
                    <a href="" class="btn text-white">
                        <i class="fa-solid fa-heart fa-lg "></i>
                        <span
                            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-white text-primary">0
                        </span>
                    </a>
                </div>
                <div class="position-relative ">
                    <a href="cart.php" class="btn text-white">
                        <i class="fa-solid fa-cart-shopping fa-lg"></i>
                        <span
                            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-white text-primary" id="count_item">0
                        </span>
                    </a>
                </div>
            </div>
            
        </div>
    </nav>


