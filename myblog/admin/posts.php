<?php

session_start();

if (isset($_SESSION['user_id'])) {

    include "../dbconnect.php";

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $id = $_POST['postID'];

        $sql = "DELETE FROM posts WHERE id = :post_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam('post_id', $id);
        $stmt->execute();

        header('location:posts.php');
    } else {

        include "layouts/nav_sidebar.php";

        $sql = "SELECT posts.*, users.name as user_name, categories.name as category_name 
        FROM posts 
        INNER JOIN users ON posts.user_id = users.id 
        INNER JOIN categories ON posts.category_id = categories.id";

        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $posts = $stmt->fetchAll();
    }

?>

    <main>
        <div class="container-fluid px-4">
            <div class="mt-3">
                <h1 class="mt-4 d-inline">Posts</h1>
                <a href="create_post.php" class="btn btn-lg btn-primary float-end">Create Post</a>
            </div>
            <ol class="breadcrumb mb-4">
                <li class="breadcrumb-item"><a href="index.php">Dashboard</a></li>
                <li class="breadcrumb-item active">Posts</li>
            </ol>

            <div class="card mb-4">
                <div class="card-header">
                    <i class="fas fa-table me-1"></i>
                    Posts
                </div>
                <div class="card-body">
                    <table id="datatablesSimple">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>User</th>
                                <th>Category</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tfoot>
                            <tr>
                                <th>Title</th>
                                <th>User</th>
                                <th>Category</th>
                                <th>Action</th>
                            </tr>
                        </tfoot>
                        <tbody>
                            <?php foreach ($posts as $post) { ?>
                                <tr>
                                    <td><?= $post['title'] ?></td>
                                    <td><?= $post['user_name'] ?></td>
                                    <td><?= $post['category_name'] ?></td>
                                    <td>
                                        <a href="../detail.php?id=<?= $post['id'] ?>" class="btn btn-sm btn-warning">Detail</a>
                                        <a href="edit_post.php?id=<?= $post['id'] ?>" class="btn btn-sm btn-outline-primary">Edit</a>
                                        <button type="button" class="btn btn-sm btn-outline-danger delete" data-post_id="<?= $post['id'] ?>">Delete</button>
                                    </td>
                                </tr>
                            <?php } ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>

    <!-- Delete Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Delete</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <h3 class="text-danger">Are you sure delete?</h3>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                    <form action="" method="POST">
                        <input type="hidden" name="postID" id="postID">
                        <button type="submit" class="btn btn-danger">Yes</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

<?php
    include "layouts/footer.php";
} else {
    header('location: ../index.php');
}


?>