<?php

session_start();
if (isset($_SESSION['user_id'])) {


    include "layouts/nav_sidebar.php";
    include "../dbconnect.php";

    $sql = "SELECT * FROM categories";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $categories = $stmt->fetchAll();
?>

    <main>
        <div class="container-fluid px-4">
            <div class="mt-3">
                <h1 class="mt-4 d-inline">Categories</h1>
                <a href="create_category.php" class="btn btn-lg btn-primary float-end">Create Category</a>
            </div>

            <ol class="breadcrumb mb-4">
                <li class="breadcrumb-item"><a href="index.php">Dashboard</a></li>
                <li class="breadcrumb-item active">Categories</li>
            </ol>

            <div class="card mb-4">
                <div class="card-header">
                    <i class="fas fa-table me-1"></i>
                    Categories
                </div>

                <div class="card-body">
                    <table id="datatablesSimple">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tfoot>
                            <tr>
                                <th>Name</th>
                                <th>Action</th>
                            </tr>
                        </tfoot>

                        <tbody>
                            <?php foreach ($categories as $category) { ?>
                                <tr>
                                    <td><?= $category['name'] ?></td>
                                    <td>
                                        <a href="../detail.php?id=<?= $category['id'] ?>" class="btn btn-sm btn-warning">Detail</a>

                                        <a href="edit_category.php?id=<?= $category['id'] ?>" class="btn btn-sm btn-outline-primary">
                                            Edit
                                        </a>

                                        <a href="delete_category.php?id=<?= $category['id'] ?>"
                                            class="btn btn-sm btn-outline-danger"
                                            onclick="return confirm('Are you sure you want to delete this category?')">
                                            Delete
                                        </a>
                                    </td>
                                </tr>
                            <?php } ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>

<?php
    include "layouts/footer.php";
} else {
    header('location: ../index.php');
}
?>