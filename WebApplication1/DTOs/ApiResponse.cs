namespace WebApplication1.DTOs.ApiResponse
{
    public class ApiResponse<T> // 
    {
        public int StatusCode {get; set;}// mã code
        public bool Status { get; set; } // cho biết request thành công hay thất bại
        public string Message { get; set; } // thông báo cho client

        public T Data { get; set; }  // dữu liệu trả về

        public List<string> Errors { get; set; }  // lưu danh sách nhiều lỗi 

        public ApiResponse()
        {
            Status = true;  // giá trị mặc định của trang thái là true
        }

    }
}