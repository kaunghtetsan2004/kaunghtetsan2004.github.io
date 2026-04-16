<?php

session_start();
if (isset($_SESSION['user_id'])) {


    include "layouts/nav_sidebar.php";
    include "../dbconnect.php";

    /* If you only want USERS (recommended) */
    $sql = "SELECT * FROM users";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $users = $stmt->fetchAll();

?>

    <main>
        <div class="container-fluid px-4">

            <div class="mt-3">
                <h1 class="mt-4 d-inline">Users</h1>
                <a href="create_user.php" class="btn btn-lg btn-primary float-end">Create User</a>
            </div>

            <ol class="breadcrumb mb-4">
                <li class="breadcrumb-item"><a href="index.php">Dashboard</a></li>
                <li class="breadcrumb-item active">Users</li>
            </ol>

            <div class="card mb-4">
                <div class="card-header">
                    <i class="fas fa-table me-1"></i>
                    Users
                </div>

                <div class="card-body">
                    <table id="datatablesSimple">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Profile</th>
                                <th>Email</th>
                                <th>Password</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            <?php foreach ($users as $user): ?>
                                <tr>
                                    <td><?= $user['name'] ?></td>
                                    <td><?= $user['profile'] ?></td>
                                    <td><?= $user['email'] ?></td>
                                    <td><?= $user['password'] ?></td>
                                    <td>
                                        <a href="../detail.php?id=<?= $user['id'] ?>" class="btn btn-sm btn-warning">Detail</a>
                                        <a href="edit_user.php?id=<?= $user['id'] ?>" class="btn btn-sm btn-outline-primary">Edit</a>
                                        <a href="delete_user.php?id=<?= $user['id'] ?>" class="btn btn-sm btn-outline-danger">Delete</a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>

                    </table>
                </div>
            </div>

        </div>
    </main>

<?php include "layouts/footer.php";
} else {
    header('location: ../index.php');
}
?>