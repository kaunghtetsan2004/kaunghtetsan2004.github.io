<?php

session_start();

if (isset($_SESSION['user_id'])) {


  require "../dbconnect.php";

  if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $title = $_POST['title'];
    $category_id = $_POST['category_id'];
    $user_id = $_SESSION['user_id'];
    $description = $_POST['description'];

    $image_path = null;
    $image_array = $_FILES['image'];

    // File Upload
    if (isset($image_array) && $image_array['size'] > 0) {
      $folder_name = 'images/';
      $image_path = $folder_name . time() . "_" . $image_array['name'];
      $tmp_name = $image_array['tmp_name'];
      move_uploaded_file($tmp_name, $image_path);
    }

    $sql = "INSERT INTO posts (title, image, description, category_id, user_id)
            VALUES (:title, :image, :description, :category_id, :user_id)";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':image', $image_path);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':category_id', $category_id);
    $stmt->bindParam(':user_id', $user_id);

    $stmt->execute();

    header("location:posts.php");
    exit();
  } else {

    include "layouts/nav_sidebar.php";

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

          <div class="mb-3">
            <label class="form-label">Title</label>
            <input type="text" class="form-control" name="title" id="title">
          </div>

          <div class="mb-3">
            <label class="form-label">Categories</label>
            <select id="category_id" name="category_id" class="form-select">
              <option selected>Choose...</option>
              <?php foreach ($categories as $category) { ?>
                <option value="<?= $category['id'] ?>">
                  <?= $category['name'] ?>
                </option>
              <?php } ?>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Image</label>
            <input type="file" class="form-control" name="image" id="image">
          </div>

          <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea class="form-control" rows="4" name="description" id="description"></textarea>
          </div>

          <button class="btn btn-primary w-100" type="submit">Create</button>

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