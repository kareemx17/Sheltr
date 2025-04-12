import Link from 'next/link'

const Header = () => {
    return (
        <header className="bg-white shadow-sm h-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                   
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold text-indigo-600">Sheltr</h1>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <Link href="/login" className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors pointer-events-auto">
                            Login
                        </Link>
                        <Link href="signup" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;