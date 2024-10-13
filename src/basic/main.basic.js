import Cart from './pages/Cart'

function main() {
  return (
    <div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        {Cart()}
      </div>
    </div>
  )
}

main()
