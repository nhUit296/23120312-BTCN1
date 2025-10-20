$(document).ready(function () {
  // =========================== Sự kiện đóng mở ===============================
  // Lắng nghe sự kiện click trên mỗi '.news-header'
  $(".toggle-icon").on("click", function () {
    // Tìm 'li.news-item' cha gần nhất của header vừa được click
    const newsItem = $(this).closest(".news-item");

    // Tìm icon và nội dung bên trong item đó
    const toggleIcon = newsItem.find(".toggle-icon");
    const newsContent = newsItem.find(".news-content");

    // Dùng slideToggle() để tạo hiệu ứng trượt lên/xuống cho nội dung
    newsContent.slideToggle();

    // Thêm/xóa class 'expanded' trên 'li.news-item'
    newsItem.toggleClass("expanded");

    // Cập nhật icon dựa trên trạng thái hiện tại
    // Kiểm tra xem item có class 'expanded' không để đổi icon
    if (newsItem.hasClass("expanded")) {
      toggleIcon.text("▼"); // Nếu đang mở, hiện icon down
      newsContent.css("display", "block"); // Sửa thành .css("display", "block")
    } else {
      toggleIcon.text("▶"); // Nếu đang đóng, hiện icon right
      newsContent.css("display", "none"); // Sửa thành .css("display", "none")
    }
  });
  // =========================== Kéo thả sắp xếp lại ===============================
  let draggingItem = null; // Item gốc đang được kéo (jQuery object)
  let shadow = null; // "Bóng" di chuyển theo chuột (jQuery object)
  let placeholder = null; // Vùng trống giữ chỗ (jQuery object)
  let offsetX = 0;
  let offsetY = 0;

  // Sử dụng event delegation cho các .drag-handle
  $(".news-list").on("mousedown", ".drag-handle", function (e) {
    e.preventDefault(); // Ngăn hành vi mặc định

    draggingItem = $(this).closest(".news-item");

    // 1. Tạo "bóng" (shadow) di chuyển theo chuột
    shadow = draggingItem.clone().addClass("news-shadow").css({
      position: "absolute",
      width: draggingItem.outerWidth(), // Giữ nguyên chiều rộng
      height: draggingItem.outerHeight(), // Giữ nguyên chiều cao
      zIndex: 1000,
      opacity: 0.4,
    });

    const originalOffset = draggingItem.offset();
    offsetX = e.pageX - originalOffset.left; // Tính toán khoảng cách chuột so với góc trái trên của item
    offsetY = e.pageY - originalOffset.top; // Tính toán khoảng cách chuột so với góc trái trên của item

    shadow.css({
      top: e.pageY - offsetY, // Đặt vị trí ban đầu của shadow
      left: e.pageX - offsetX,
    });

    $("body").append(shadow); // Thêm shadow vào body

    // 3. Gán sự kiện di chuyển và thả chuột
    $(document).on("mousemove.dragNews", onMouseMove);
    $(document).on("mouseup.dragNews", onMouseUp);
  });

  function onMouseMove(e) {
    // Cập nhật vị trí của shadow theo chuột
    if (shadow) {
      shadow.css({
        top: e.pageY - offsetY,
        left: e.pageX - offsetX,
      });
    }
  }

  function onMouseUp(e) {
    const targetElement = getElementUnderMouse(e);
    if (targetElement) {
      // Nếu tìm thấy phần tử dưới chuột
      const targetItem = $(targetElement).closest(".news-item"); // Tìm .news-item cha gần nhất
      if (targetItem.length > 0 && !targetItem.is(draggingItem)) {
        // Nếu tìm thấy và không phải là item đang kéo
        const targetRect = targetItem[0].getBoundingClientRect(); // Lấy kích thước và vị trí của item mục tiêu
        targetItem.before(draggingItem); // Chèn draggingItem trước item mục tiêu
      }
    }
    // Dọn dẹp
    if (shadow) {
      shadow.remove();
    }

    draggingItem = null;
    shadow = null;

    // Gỡ bỏ sự kiện
    $(document).off("mousemove.dragNews mouseup.dragNews");
  }

  function getElementUnderMouse(e) {
    if (shadow) shadow.hide();
    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (shadow) shadow.show();
    return element;
  }

  // =========================== Hiển thị popover ===============================
  $("#style-settings-btn").on("click", function () {
    const popover = $(".style-popover");
    if (popover.css("display") === "none") {
      popover.css("display", "flex");
      popover.css("flex-direction", "column");
    } else {
      popover.css("display", "none");
    }
  });

  // ============================= Xử lý Sample Text ========================
  const $sampleTextLabel = $("#sample-text-label");
  const styleInputs =
    "#text-color-input, #bg-color-input, #bold-cb, #italic-cb, #underline-cb"; // Chọn tất cả các input liên quan đến style
  function applySampleStyles() {
    $sampleTextLabel.css({
      color: $("#text-color-input").val(),
      backgroundColor: $("#bg-color-input").val(),
      fontWeight: $("#bold-cb").is(":checked") ? "bold" : "normal",
      fontStyle: $("#italic-cb").is(":checked") ? "italic" : "normal",
      textDecoration: $("#underline-cb").is(":checked") ? "underline" : "none",
    });
  }
  $(styleInputs).on("input change", applySampleStyles);
  applySampleStyles(); // Áp dụng lần đầu

  // ============================= Xử lý highlight =========================
  const $processText = $("#process-text");
  const originalTextContent = $processText.html();

  function applyHighlightStyles() {
    $(".highlighted-text").css({
      color: $("#text-color-input").val(),
      backgroundColor: $("#bg-color-input").val(),
      fontWeight: $("#bold-cb").is(":checked") ? "bold" : "normal",
      fontStyle: $("#italic-cb").is(":checked") ? "italic" : "normal",
      textDecoration: $("#underline-cb").is(":checked") ? "underline" : "none",
    });
  }

  $("#highlight-btn").on("click", function () {
    $processText.html(originalTextContent);
    const searchTerm = $("#pattern-input").val();
    if (!searchTerm) return;

    try {
      const regex = new RegExp(searchTerm, "gi");
      const newText = originalTextContent.replace(
        regex,
        (match) => `<span class="highlighted-text">${match}</span>`
      );
      $processText.html(newText);
      applyHighlightStyles();
    } catch (e) {
      alert("Biểu thức Regex không hợp lệ!");
    }
  });

  // ============================== Xử lý delete ========================
  $("#delete-btn").on("click", function () {
    const searchTerm = $("#pattern-input").val();
    if (!searchTerm) return;
    try {
      const regex = new RegExp(searchTerm, "gi");
      const newText = $processText.html().replace(regex, "");
      $processText.html(newText);
    } catch (e) {
      alert("Biểu thức Regex không hợp lệ!");
    }
  });

  // ============================== Xử lý reset ==========================
  $("#reset-btn").on("click", () => $processText.html(originalTextContent));

  // ============================= Xử lý add ===========================
  $("#btn-add-new").on("click", function () {
    const selected = $("#animal-select option:selected");
    // Tạo item mới chỉ chứa ký tự emoji
    const newItemHTML = `<div style="display: flex; flex-direction: column; align-items: center;" class="animal-item">
      <div class="box bg1" data-animal="${selected.val()}">
        ${selected.text()}
      </div>
      <p style="margin: 0">${selected.val()}</p>
    </div>
      `;
    $("#drag-drop-grid").append(newItemHTML);
  });

  // ================================= Kéo thả để sắp xếp các ANIMAL ==============================
  let draggingAnimal = null;
  let animalShadow = null;
  let animalPlaceholder = null;
  let animalOffsetX = 0;
  let animalOffsetY = 0;

  $("#drag-drop-grid").on("mousedown", ".animal-item", function (e) {
    e.preventDefault();
    draggingAnimal = $(this);

    const originalOffset = draggingAnimal.offset();
    animalOffsetX = e.pageX - originalOffset.left;
    animalOffsetY = e.pageY - originalOffset.top;

    animalShadow = draggingAnimal
      .clone()
      .addClass("animal-shadow")
      .css({
        position: "absolute",
        top: e.pageY - animalOffsetY,
        left: e.pageX - animalOffsetX,
        width: draggingAnimal.outerWidth(),
        height: draggingAnimal.outerHeight(),
        pointerEvents: "none",
        zIndex: 1000,
      });
    $("body").append(animalShadow);

    // animalPlaceholder = $("<div></div>").addClass("animal-placeholder").css({
    //   width: draggingAnimal.outerWidth(),
    //   height: draggingAnimal.outerHeight(),
    // });
    // draggingAnimal.after(animalPlaceholder);
    // draggingAnimal.hide();

    const imageBox = draggingAnimal.find(".box"); // Tìm phần tử chứa ảnh
    animalPlaceholder = $("<div></div>")
      .addClass("animal-placeholder")
      .css({
        width: imageBox.outerWidth(), // Lấy chiều rộng của ảnh
        height: imageBox.outerHeight(), // Lấy chiều cao của ảnh
        margin: draggingAnimal.css("margin"), // Giữ lại margin để căn chỉnh đúng trong grid
      });
    draggingAnimal.after(animalPlaceholder);
    draggingAnimal.hide();

    $(document).on("mousemove.dragAnimal", onAnimalMouseMove);
    $(document).on("mouseup.dragAnimal", onAnimalMouseUp);
  });

  function onAnimalMouseMove(e) {
    if (animalShadow) {
      animalShadow.css({
        top: e.pageY - animalOffsetY,
        left: e.pageX - animalOffsetX,
      });
    }

    const targetElement = getElementUnderMouse(e, animalShadow);
    const targetItem = $(targetElement).closest(".animal-item");
    const grid = $("#drag-drop-grid");

    if (targetItem.length > 0 && !targetItem.is(draggingAnimal)) {
      // --- PHẦN LOGIC MỚI BẰNG INDEX ---

      // Lấy index của placeholder (vị trí nó đang đứng)
      const placeholderIndex = animalPlaceholder.index();

      // Lấy index của item mục tiêu (nơi chuột đang trỏ vào)
      const targetIndex = targetItem.index();

      animalPlaceholder.css("border", "2px dashed #000"); // Hiển thị border cho placeholder
      animalPlaceholder.css("border-radius", "10px");

      // So sánh hai index
      if (placeholderIndex < targetIndex) {
        // Nếu placeholder đang ở TRƯỚC item mục tiêu, hãy chèn nó VÀO SAU
        targetItem.after(animalPlaceholder);
      } else {
        // Ngược lại (placeholder đang ở SAU), hãy chèn nó VÀO TRƯỚC
        targetItem.before(animalPlaceholder);
      }
    } else if (
      $(targetElement).is(grid) &&
      grid.find(animalPlaceholder).length === 0
    ) {
      // Nếu di chuột vào vùng trống của grid, đặt placeholder ở cuối.
      grid.append(animalPlaceholder);
    }
  }

  function onAnimalMouseUp() {
    if (draggingAnimal && animalPlaceholder) {
      animalPlaceholder.replaceWith(draggingAnimal);
      draggingAnimal.show();
    }

    if (animalShadow) animalShadow.remove();

    draggingAnimal = null;
    animalShadow = null;
    animalPlaceholder = null;

    $(document).off(".dragAnimal");
  }
});
