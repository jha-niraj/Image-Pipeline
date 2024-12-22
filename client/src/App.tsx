import { Route, Routes } from "react-router-dom"
import ImagePaintingApp from "./components/ImagePainting"
import ImagePair from "./pages/ImagePair"
import AllImagePair from "./pages/AllImagePair"

function App() {

	return (
		<Routes>
			<Route path="/" element={<ImagePaintingApp />} />
			<Route path="/imagepair" element={<ImagePair />} />
			<Route path="/allimagespair" element={<AllImagePair />} />
		</Routes>
	)
}

export default App
