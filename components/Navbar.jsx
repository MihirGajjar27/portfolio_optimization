import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar({current_page}) {

	const [isHome, setIsHome] = useState(false);
	const [isAbout, setIsAbout] = useState(false);
	const [isQuiz, setIsQuiz] = useState(false);

	useEffect(() => {
		current_page === "home" ? setIsHome(true) : null;
		current_page === "about" ? setIsAbout(true) : null;
		current_page === "quiz" ? setIsQuiz(true) : null;
	}, [current_page]);

	return(
		<div className={"flex flex-row flex-nowrap space-x-4 text-lg items-center"}>
			<Link href={'/'} className={`px-3 py-2 text-gray-800 hover:text-black hover:underline hover:underline-offset-2 "${isHome ? "underline underline-offset-2" : "hover:underline hover:underline-offset-2"}" drop-shadow-lg rounded-lg transition-all duration-200`}>
				Home
			</Link>
			<Link href={'/about'} className={`px-3 py-2 text-gray-800 hover:text-black hover:underline hover:underline-offset-2 "${isAbout ? "underline underline-offset-2" : ""}" drop-shadow-lg rounded-lg transition-all duration-200`}>
				About
			</Link>
			<Link href={'/risk_profile_quiz'} className={`px-3 py-2 text-gray-800 hover:text-black hover:underline hover:underline-offset-2 "${isQuiz ? "underline underline-offset-2" : ""}" drop-shadow-lg rounded-lg transition-all duration-200`}>
				Quiz
			</Link>
		</div>
	)
}