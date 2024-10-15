import { HeaderText, CartDisplay, TotalPrice, ProductSelect, AddButton, StockInfo } from "../components"

export const initCart = () => {
  const root = document.getElementById("app")
  const cont = document.createElement("div")
  const wrap = document.createElement("div")

  cont.className = "bg-gray-100 p-8"
  wrap.className = "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8"

  wrap.innerHTML += HeaderText()
  wrap.innerHTML += CartDisplay()
  wrap.innerHTML += TotalPrice()
  wrap.innerHTML += ProductSelect()
  wrap.innerHTML += AddButton()
  wrap.innerHTML += StockInfo()

  cont.appendChild(wrap)
  root.appendChild(cont)
}
