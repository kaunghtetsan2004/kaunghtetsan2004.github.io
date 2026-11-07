<?php

include "dbconnect.php";

$sql = "SELECT * FROM categories";
$stmt = $conn->prepare($sql);
$stmt->execute();
$categories = $stmt->fetchAll();

?>

<!-- Side widgets-->
<div class="col-lg-4">

    <!-- Search widget-->
    <div class="card mb-4">
        <div class="card-header">Search</div>
        <div class="card-body">
            <div class="input-group">
                <input class="form-control" type="text" placeholder="Enter search term..." />
                <button class="btn btn-primary" type="button">Go!</button>
            </div>
        </div>
    </div>

    <!-- Categories widget-->
    <div class="card mb-4">
        <div class="card-header">Categories</div>
        <div class="card-body">
            <div class="row">
                <div class="col-sm-6">
                    <ul class="list-unstyled mb-0">

                        <?php foreach ($categories as $category): ?>
                            <li>
                                <a href="index.php?category_id=<?= $category['id'] ?>">
                                    <?= $category['name'] ?>
                                </a>
                            </li>
                        <?php endforeach; ?>

                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- Side widget-->
    <div class="card mb-4">
        <div class="card-header">Side Widget</div>
        <div class="card-body">
            You can put anything you want inside of these side widgets.
        </div>
    </div>

</div>
</div>
</div>

<!-- Footer-->
<footer class="py-5 bg-dark">
    <div class="container">
        <p class="m-0 text-center text-white">
            Copyright &copy; Your Website 2023
        </p>
    </div>
</footer>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="js/scripts.js"></script>

</body>
</html>