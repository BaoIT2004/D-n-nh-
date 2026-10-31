

function AddStatusItem() {
    return (
    <div className="w-80 rounded-lg bg-white p-4 shadow">
      <p className="mb-5">Dự án tiếp theo</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">☑ PROJ-4</span>
        <div className="flex items-center gap-3">
          <span className="font-bold text-orange-500">=</span>
          <div className="h-8 w-8 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}