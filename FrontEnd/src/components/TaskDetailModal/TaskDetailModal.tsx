import { useNavigate } from "react-router-dom";

export default function TaskDetailModal() {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <section
                aria-labelledby="task-detail-title"
                aria-modal="true"
                className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-xl"
                role="dialog"
            >
                <header className="flex items-center justify-between border-b border-slate-300 px-6 py-3 text-sm">
                    <p className="text-gray-500">
                        Project /{" "}
                        <span className="rounded bg-purple-100 px-1.5 py-0.5 font-semibold text-purple-700">
                            TASK-9
                        </span>
                    </p>
                    <button
                        aria-label="Close task details"
                        className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                        onClick={() => navigate(-1)}
                        type="button"
                    >
                        ×
                    </button>
                </header>

                <div className="grid md:grid-cols-[1fr_320px]">
                    <div className="space-y-6 p-6 md:border-r border-slate-300 md:border-slate-300">
                        <h1
                            className="text-2xl font-semibold text-gray-900"
                            id="task-detail-title"
                        >
                            Fix bug
                        </h1>

                        <section>
                            <h2 className="mb-2 text-sm font-semibold text-gray-800">
                                Description
                            </h2>
                            <textarea
                                className="w-full resize-y rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Add a description..."
                                rows={4}
                            />
                        </section>

                        <section>
                            <h2 className="mb-2 text-sm font-semibold text-gray-800">
                                Attachments
                            </h2>
                            <div className="flex justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8">
                                <button
                                    className="rounded-md border bg-white px-4 py-1.5 text-sm font-medium shadow-sm hover:bg-gray-50"
                                    type="button"
                                >
                                    + Add attachment
                                </button>
                            </div>
                        </section>

                        <section>
                            <h2 className="mb-1 text-sm font-semibold text-gray-800">
                                Subtasks
                            </h2>
                            <button
                                className="rounded px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
                                type="button"
                            >
                                + Add subtask
                            </button>
                        </section>
                    </div>

                    <aside className="bg-gray-50/60 p-6">
                        <div className="overflow-hidden rounded-xl border border-slate-300 bg-white text-sm shadow-sm">
                            <h2 className="bg-gray-100 px-4 py-3 text-base font-semibold text-gray-800">
                                Details
                            </h2>
                            <dl className="space-y-5 p-4">
                                <div>
                                    <dt className="mb-1 text-xs font-medium text-gray-500">
                                        Assignee
                                    </dt>
                                    <dd className="text-gray-500">Unassigned</dd>
                                </div>
                                <div>
                                    <dt className="mb-1 text-xs font-medium text-gray-500">
                                        Parent
                                    </dt>
                                    <dd className="text-gray-500">Add parent</dd>
                                </div>
                                <div>
                                    <dt className="mb-1 text-xs font-medium text-gray-500">
                                        Priority
                                    </dt>
                                    <dd>
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                            Medium
                                        </span>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="mb-1 text-xs font-medium text-gray-500">
                                        Labels
                                    </dt>
                                    <dd className="text-gray-500">Add labels</dd>
                                </div>
                                <div>
                                    <dt className="mb-1 text-xs font-medium text-gray-500">
                                        Start date
                                    </dt>
                                    <dd className="text-gray-500">Add date</dd>
                                </div>
                                <div>
                                    <dt className="mb-1 text-xs font-medium text-gray-500">
                                        Due date
                                    </dt>
                                    <dd className="text-gray-500">Add due date</dd>
                                </div>
                                <div>
                                    <dt className="mb-1 text-xs font-medium text-gray-500">
                                        Reporter
                                    </dt>
                                    <dd className="text-gray-800">Project member</dd>
                                </div>
                            </dl>
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    );
}
