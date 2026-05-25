const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const dropZone = document.getElementById("dropZone");

const postBtn = document.getElementById("postBtn");
const postsGrid = document.getElementById("postsGrid");

let selectedImage = "";

/* IMAGE UPLOAD */

dropZone.addEventListener("click", () => {
  imageInput.click();
});

imageInput.addEventListener("change", function () {

  const file = this.files[0];

  if(file){

    const reader = new FileReader();

    reader.onload = function(e){

      selectedImage = e.target.result;

      previewImage.src = selectedImage;
      previewImage.style.display = "block";

    };

    reader.readAsDataURL(file);
  }

});

/* CREATE POST */

postBtn.addEventListener("click", () => {

  const username = document.getElementById("username").value;
  const caption = document.getElementById("captionText").value;

  if(caption.trim() === ""){
    alert("Write something!");
    return;
  }

  if(postsGrid.querySelector(".empty-state")){
    postsGrid.innerHTML = "";
  }

  const card = document.createElement("div");
  card.className = "post-card";

  card.innerHTML = `
  
    ${
      selectedImage
      ? `<img src="${selectedImage}">`
      : ``
    }

    <div class="card-body">

      <div class="card-name">
        ${username || "UNKNOWN"}
      </div>

      <div class="card-caption">
        ${caption}
      </div>

    </div>

  `;

  postsGrid.prepend(card);

  document.getElementById("username").value = "";
  document.getElementById("captionText").value = "";

  previewImage.style.display = "none";
  selectedImage = "";

});
