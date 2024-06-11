export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-600 dark:text-white">
      <div className="flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-gray-300"></div>
        <p className="text-lg pt-4">Loading...</p>
      </div>
    </div>
  )
}