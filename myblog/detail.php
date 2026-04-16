<?php
include "layouts/navbar.php";
include "dbconnect.php";

$id = $_GET['id'];

$sql = "SELECT posts.*, categories.name as category_name, users.name as user_name 
        FROM posts 
        INNER JOIN categories ON posts.category_id = categories.id 
        INNER JOIN users ON posts.user_id = users.id  
        WHERE posts.id = :postID";

$stmt = $conn->prepare($sql);
$stmt->bindParam(':postID', $id);
$stmt->execute();
$post = $stmt->fetch(PDO::FETCH_ASSOC);

?>

<!-- Page content-->
<div class="container mt-5">
    <div class="row">
        <div class="col-lg-8">

            <!-- Post content-->
            <article>

                <!-- Post header-->
                <header class="mb-4">

                    <!-- Title -->
                    <h1 class="fw-bolder mb-1">
                        <?= $post['title'] ?>
                    </h1>

                    <!-- Meta -->
                    <div class="text-muted fst-italic mb-2">
                        Posted on 
                        <?= date('M d, Y', strtotime($post['created_at'])) ?>    
                        by
                        <?= $post['user_name'] ?>
                    </div>

                    <!-- Category -->
                    <a class="badge bg-secondary text-decoration-none link-light" href="#">
                        <?= $post['category_name'] ?>
                    </a>

                </header>

                <!-- Image -->
                <figure class="mb-4">
                    <img class="img-fluid rounded" src="admin/<?= $post['image'] ?>" alt="..." />
                </figure>

                <!-- Description -->
                <section class="mb-5">
                    <p class="fs-5 mb-4">
                        <?= $post['description'] ?>
                    </p>
                </section>

            </article>

        </div>

<?php include "layouts/footer.php"; ?>