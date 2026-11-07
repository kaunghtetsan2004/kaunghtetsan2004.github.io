<?php

session_start();

if (isset($_SESSION['user_id'])) {


  require "../dbconnect.php";

  if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $id = $_POST['postID'];
    $title = $_POST['title'];
    $category_id = $_POST['category_id'];
    $user_id = $_SESSION['user_id'];
    $description = $_POST['description'];
    $old_photo = $_POST['old_photo'];

    // File Upload
    $image_array = $_FILES['image'];

    if (isset($image_array) && $image_array['size'] > 0 && !empty($image_array['name'])) {
      $folder_name = 'images/';
      $image_path = $folder_name . time() . '_' . $image_array['name'];
      move_uploaded_file($image_array['tmp_name'], $image_path);
    } else {
      $image_path = $old_photo;
    }

    $sql = "UPDATE posts 
          SET title=:title, 
              category_id=:category_id, 
              user_id=:user_id, 
              description=:description, 
              image=:image_path 
          WHERE id=:id";

    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':category_id', $category_id);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':image_path', $image_path);

    $stmt->execute();

    header("location:posts.php");
    exit;
  } else {

    include "layouts/nav_sidebar.php";

    $post_id = $_GET['id'] ?? null;
    $post = [];

    if ($post_id) {
      $sql = "SELECT * FROM posts WHERE id = :post_id";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(':post_id', $post_id);
      $stmt->execute();
      $post = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    $sql = "SELECT * FROM categories";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $categories = $stmt->fetchAll();
  }

?>

  <div class="content">

    <div class="d-flex justify-content-between mb-3">
      <h3>Create Posts</h3>
      <button class="btn btn-danger">Cancel</button>
    </div>

    <div class="card">
      <div class="card-body">

        <form action="<?= htmlspecialchars($_SERVER['PHP_SELF']) ?>" method="POST" enctype="multipart/form-data">

          <!-- FIXED: correct PHP echo -->
          <input type="hidden" name="postID" value="<?= $post['id'] ?>">

          <div class="mb-3">
            <label class="form-label">Title</label>
            <input type="text" class="form-control" name="title" id="title" value="<?= $post['title'] ?>">
          </div>

          <div class="mb-3">
            <label class="form-label">Categories</label>
            <select id="category_id" name="category_id" class="form-select">
              <option selected>Choose...</option>

              <?php foreach ($categories as $category) { ?>
                <option value="<?= $category['id'] ?>"
                  <?= $post['category_id'] == $category['id'] ? 'selected' : '' ?>>
                  <?= $category['name'] ?>
                </option>
              <?php } ?>

            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Image</label>

            <ul class="nav nav-tabs" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="image-tab" data-bs-toggle="tab" data-bs-target="#image-tab-pane" type="button" role="tab">Image</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="new_image-tab" data-bs-toggle="tab" data-bs-target="#new_image-tab-pane" type="button" role="tab">New Image</button>
              </li>
            </ul>

            <div class="tab-content" id="myTabContent">
              <div class="tab-pane fade show active" id="image-tab-pane" role="tabpanel">
                <img src="<?= $post['image'] ?>" alt="" width="200" height="100" class="my-3">

                <input type="hidden" name="old_photo" value="<?= $post['image'] ?>">
              </div>

              <div class="tab-pane fade" id="new_image-tab-pane" role="tabpanel">
                <input type="file" class="form-control my-3" name="image" id="image">
              </div>
            </div>

          </div>

          <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea class="form-control" rows="4" name="description"><?= $post['description'] ?? '' ?></textarea>
          </div>

          <button class="btn btn-primary w-100" type="submit">Update</button>

        </form>

      </div>
    </div>

  </div>

<?php

  include "layouts/footer.php";
} else {
  header('location: ../index.php');
}

?>