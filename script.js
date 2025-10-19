$(document).ready(function () {
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
});
