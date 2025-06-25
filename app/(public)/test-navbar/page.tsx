export default function TestNavbarPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Navbar Test Page</h1>
        <p className="text-gray-600 mb-8">
          This page is used to test if the navbar is displaying correctly.
        </p>
        
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Test Content</h2>
          <p className="text-gray-700">
            If you can see this content and the navbar at the top, then the navbar is working correctly.
          </p>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Navbar should be visible:</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Fixed at the top of the page</li>
              <li>• Contains the SkillConnect logo</li>
              <li>• Has navigation links (Home, About, Jobs, Contact)</li>
              <li>• Has Login and Sign Up buttons</li>
              <li>• Has a theme toggle button</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 