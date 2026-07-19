import Link from 'next/link';

export default function Home() {
  return (
    <main className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">demo-nextjs</h1>
      <p className="text-gray-500 mb-6">
        my-harness-flow 示例项目 — 任务管理器
      </p>
      <Link
        href="/tasks"
        className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        进入任务管理
      </Link>
    </main>
  );
}
