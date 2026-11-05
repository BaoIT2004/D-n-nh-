# Hướng dẫn dùng React Query và tránh gọi API trùng

Tài liệu này ghi lại cách ứng dụng chia sẻ dữ liệu danh sách dự án giữa bảng dự án và sidebar bằng TanStack Query.

## 1. Cài package

Trong thư mục `FrontEnd`, cài React Query:

```bash
npm install @tanstack/react-query
```

Devtools là tùy chọn:

```bash
npm install @tanstack/react-query-devtools
```

## 2. Bọc ứng dụng bằng QueryClientProvider

Tạo một `QueryClient` duy nhất và bọc phần ứng dụng cần dùng query. Trong dự án này, provider được khai báo tại `src/App/providers.tsx` và `<Provides>` được dùng trong `src/main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function Provides({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
```

Trong `main.tsx`, đặt provider quanh `<App />`:

```tsx
<BrowserRouter>
    <Provides>
        <App />
    </Provides>
    <Toaster position="top-right" />
</BrowserRouter>
```

## 3. Tạo một query dùng chung

Hai component chỉ chia sẻ cache và request nếu chúng dùng cùng một `QueryClient` và cùng `queryKey`. Đặt logic gọi API vào một custom hook để tránh tạo các request độc lập trong từng component.

`src/hooks/use-projects.ts`:

```ts
import { useQuery } from "@tanstack/react-query";
import { getStoredUserId } from "../services/Api";
import { AllProject } from "../services/projectService";

export function useProjects() {
    const userId = getStoredUserId();
    const isAuthenticated =
        Boolean(localStorage.getItem("accessToken")) && userId !== null;

    return useQuery({
        queryKey: ["projects", userId],
        queryFn: async () => {
            const result = await AllProject();

            if (!result.success) {
                throw new Error(result.message);
            }

            return result.data;
        },
        enabled: isAuthenticated,
        retry: false,
        staleTime: 60_000,
    });
}
```

- `queryKey` xác định dữ liệu trong cache. Thêm `userId` để dữ liệu của các tài khoản không bị dùng lẫn.
- `enabled` ngăn gọi API khi chưa có token hoặc user ID.
- `retry: false` tắt việc tự thử lại query khi thất bại.
- `staleTime: 60_000` xem dữ liệu là mới trong 60 giây, tránh refetch không cần thiết trong thời gian đó.
- `queryFn` cần trả về dữ liệu hoặc ném lỗi. Không trả về hàm service chưa được gọi.

## 4. Dùng cùng hook trong các component

Trong `AllProject.tsx` và `SidebarLeft.tsx`, dùng chung hook:

```tsx
const { data: projects = [], isPending, isError, error } = useProjects();
```

Sau đó dùng `projects` để render bảng hoặc danh sách sidebar. Không gọi `AllProject()` thêm trong một `useEffect` riêng ở component còn lại; cách đó tạo một luồng fetch độc lập ngoài cache của React Query.

Có thể hiển thị trạng thái query trong JSX:

```tsx
{isPending && <p>Đang tải...</p>}
{isError && <p role="alert">{error.message}</p>}
```

Không gọi `toast.success()` hoặc `toast.error()` ngay trong lúc render. Component có thể render nhiều lần, dẫn tới toast lặp; nếu cần toast, hãy gọi trong event handler hoặc `useEffect`.

## 5. Kiểm tra request trong trình duyệt

1. Chạy frontend, mở DevTools của trình duyệt rồi chọn **Network**.
2. Chọn **Fetch/XHR**, bật **Disable cache**, xóa danh sách request và tải lại trang.
3. Tìm request `GET /api/newProject/{userId}`. Khi bảng và sidebar cùng dùng `useProjects()` với cùng key, chúng dùng chung query/cache thay vì tự tạo hai luồng tải dữ liệu.
4. Nhìn cột **Initiator** và URL để xác định request nào đang lặp. Các request `login` là request khác, không phải request danh sách dự án.
5. React `StrictMode` có thể chạy lại vòng đời effect trong môi trường phát triển. Việc chuyển các component sang cùng query giúp việc tải danh sách được quản lý chung; không nên bỏ `StrictMode` chỉ để che request trùng.

## 6. Ghi nhớ về lỗi thử nghiệm và deduplication

- Deduplication không phải một API hoặc lỗi riêng. React Query chia sẻ query đang chạy khi các observer dùng cùng query key trong cùng `QueryClient`.
- Cache, `staleTime`, invalidation, refetch khi focus/mount và việc tạo nhiều `QueryClient` đều ảnh hưởng đến số request thấy trong Network.
- Một service cố tình `throw new Error(...)` chỉ kiểm tra luồng lỗi của query; nó không gửi HTTP request. Để kiểm tra request thật, `queryFn` phải gọi service/API thật.
- Để thử lỗi query, đọc `isError`/`error` và tắt retry trong query. Không dùng `return toast.error(...)` làm kết quả render.
- `skeletonCards` không phải thành phần có sẵn của React Query; đó là placeholder UI do ứng dụng tự tạo hoặc import từ component riêng.
